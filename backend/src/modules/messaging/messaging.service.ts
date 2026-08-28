import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { MessageStatus } from '../../common/enums';

const MAX_MESSAGE_LENGTH = 2000;
const ALLOWED_ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024;

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private gateway: any = null;

  constructor(
    @InjectRepository(ConversationEntity)
    private readonly convRepo: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    @InjectQueue('TRANSLATION')
    private readonly translationQueue: Queue,
    @InjectQueue('NOTIFICATIONS')
    private readonly notifQueue: Queue,
  ) {}

  setGateway(gw: any) {
    this.gateway = gw;
  }

  /** Get or create conversation between artisan and buyer (one per pair) */
  async getOrCreateConversation(artisanId: string, buyerId: string, rfqId?: string) {
    let conv = await this.convRepo.findOne({ where: { artisanId, buyerId } });
    if (!conv) {
      conv = await this.convRepo.save({ artisanId, buyerId, rfqId: rfqId ?? null });
    }
    return conv;
  }

  /** Persist a message and deliver it (Req 15.1, 15.2) */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    attachment?: { key: string; mimetype: string; size: number },
  ): Promise<MessageEntity> {
    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new BadRequestException(`Message exceeds ${MAX_MESSAGE_LENGTH} characters`);
    }

    if (attachment) {
      if (!ALLOWED_ATTACHMENT_TYPES.includes(attachment.mimetype)) {
        throw new BadRequestException('Unsupported attachment type');
      }
      if (attachment.size > MAX_ATTACHMENT_SIZE) {
        throw new BadRequestException('Attachment exceeds 25 MB limit');
      }
    }

    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');

    // Persist message first, then deliver (Req 15.1)
    const message = await this.messageRepo.save({
      conversationId,
      senderId,
      content,
      deliveryStatus: MessageStatus.SENT,
      attachmentKey: attachment?.key ?? null,
    });

    // Enqueue translation if needed
    const recipientId = conv.artisanId === senderId ? conv.buyerId : conv.artisanId;
    await this.translationQueue.add({
      messageId: message.id,
      content,
      senderId,
      recipientId,
      conversationId,
    });

    // Push to recipient via WebSocket
    if (this.gateway) {
      this.gateway.sendToUser(recipientId, 'message:new', {
        messageId: message.id,
        content,
        senderId,
        conversationId,
        timestamp: message.createdAt,
        deliveryStatus: MessageStatus.SENT,
      });
    }

    return message;
  }

  /** Update delivery status — only forward transitions allowed (Req 15.5) */
  async updateDeliveryStatus(messageId: string, newStatus: MessageStatus): Promise<void> {
    const msg = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!msg) return;

    const order = [MessageStatus.SENT, MessageStatus.DELIVERED, MessageStatus.READ];
    if (order.indexOf(newStatus) <= order.indexOf(msg.deliveryStatus)) {
      return; // No backwards transitions
    }

    await this.messageRepo.update(messageId, { deliveryStatus: newStatus });
  }

  /** Deliver all undelivered messages to a reconnected user */
  async getUndeliveredMessages(userId: string) {
    return this.messageRepo
      .createQueryBuilder('m')
      .innerJoin('conversations', 'c', 'c.id = m.conversation_id')
      .where('(c.artisan_id = :userId OR c.buyer_id = :userId)', { userId })
      .andWhere('m.sender_id != :userId', { userId })
      .andWhere("m.delivery_status = 'SENT'")
      .orderBy('m.created_at', 'ASC')
      .getMany();
  }

  /** Flag a conversation for moderation (Req 15.7) */
  async flagConversation(conversationId: string, moderatorId: string): Promise<void> {
    await this.convRepo.update(conversationId, { flagged: true });
  }

  async getConversationMessages(conversationId: string, userId: string) {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (conv.artisanId !== userId && conv.buyerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }
}
