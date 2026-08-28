import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { TrustEventType } from '../../../common/enums';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('trust_events')
export class TrustEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'event_type', type: 'enum', enum: TrustEventType })
  eventType!: TrustEventType;

  @Column({ name: 'base_weight', type: 'numeric', precision: 5, scale: 2 })
  baseWeight!: number;

  @Column({ name: 'applied_weight', type: 'numeric', precision: 5, scale: 2 })
  appliedWeight!: number;

  @Column({ name: 'ref_order_id', type: 'uuid', nullable: true })
  refOrderId!: string | null;

  @Column({ name: 'ref_review_id', type: 'uuid', nullable: true })
  refReviewId!: string | null;

  @Column({ name: 'ref_dispute_id', type: 'uuid', nullable: true })
  refDisputeId!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
