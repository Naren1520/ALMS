import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MessageStatus } from '../../common/enums';

@WebSocketGateway({ cors: { origin: '*', credentials: true }, namespace: '/ws' })
export class MessagingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MessagingGateway.name);
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly messagingService: MessagingService,
    private readonly notificationsService: NotificationsService,
  ) {}

  afterInit() {
    this.messagingService.setGateway(this);
    this.notificationsService.setGateway(this);
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId as string;
    if (userId) {
      client.join(`user:${userId}`);
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);

      // Deliver undelivered messages on reconnect (Req 15.6)
      this.messagingService
        .getUndeliveredMessages(userId)
        .then((msgs) => msgs.forEach((m) => client.emit('message:new', m)))
        .catch(() => {});
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth?.userId as string;
    if (userId) {
      this.userSockets.get(userId)?.delete(client.id);
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  /** Send an event to a specific user (all their sockets) */
  sendToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  @SubscribeMessage('message:send')
  async handleMessageSend(
    client: Socket,
    payload: { conversationId: string; content: string },
  ) {
    const senderId = client.handshake.auth?.userId as string;
    if (!senderId) return;
    await this.messagingService.sendMessage(
      payload.conversationId,
      senderId,
      payload.content,
    );
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    client: Socket,
    payload: { conversationId: string; lastReadMessageId: string },
  ) {
    await this.messagingService.updateDeliveryStatus(
      payload.lastReadMessageId,
      MessageStatus.READ,
    );
    this.server
      .to(`conversation:${payload.conversationId}`)
      .emit('message:status', {
        messageId: payload.lastReadMessageId,
        status: MessageStatus.READ,
      });
  }
}
