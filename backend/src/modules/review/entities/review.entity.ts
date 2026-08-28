import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { ReviewStatus } from '../../../common/enums';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'order_id', type: 'uuid', unique: true })
  orderId!: string;

  @Column({ name: 'reviewer_id', type: 'uuid' })
  reviewerId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer!: UserEntity;

  @Column({ name: 'reviewed_id', type: 'uuid' })
  reviewedId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewed_id' })
  reviewed!: UserEntity;

  @Column({ type: 'smallint' })
  rating!: number;

  @Column({ name: 'text_review', type: 'text', nullable: true })
  textReview!: string | null;

  @Column({
    name: 'moderation_status',
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING_MODERATION,
  })
  moderationStatus!: ReviewStatus;

  @Column({ name: 'artisan_reply', type: 'text', nullable: true })
  artisanReply!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
