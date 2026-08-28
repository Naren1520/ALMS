import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { DisputeCategory, DisputeResolution, DisputeStatus } from '../../../common/enums';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('disputes')
export class DisputeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId!: string;

  @Column({ name: 'opened_by', type: 'uuid' })
  openedBy!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'opened_by' })
  opener!: UserEntity;

  @Column({ type: 'enum', enum: DisputeCategory })
  category!: DisputeCategory;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.OPEN })
  status!: DisputeStatus;

  @Column({ name: 'assigned_to', type: 'uuid', nullable: true })
  assignedTo!: string | null;

  @Column({ type: 'enum', enum: DisputeResolution, nullable: true })
  resolution!: DisputeResolution | null;

  @Column({ type: 'text', nullable: true })
  rationale!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt!: Date | null;
}
