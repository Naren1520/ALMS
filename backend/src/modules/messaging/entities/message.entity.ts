import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageStatus } from '../../../common/enums';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId!: string;

  @ManyToOne(() => ConversationEntity)
  @JoinColumn({ name: 'conversation_id' })
  conversation!: ConversationEntity;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'sender_id' })
  sender!: UserEntity;

  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'content_trans', type: 'text', nullable: true })
  contentTrans!: string | null;

  @Column({ name: 'source_lang', type: 'text', nullable: true })
  sourceLang!: string | null;

  @Column({ name: 'target_lang', type: 'text', nullable: true })
  targetLang!: string | null;

  @Column({ name: 'attachment_key', type: 'text', nullable: true })
  attachmentKey!: string | null;

  @Column({
    name: 'delivery_status',
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  deliveryStatus!: MessageStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
