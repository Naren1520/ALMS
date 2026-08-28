import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { AiJobType, AiJobStatus } from '../../../common/enums';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('ai_jobs')
export class AiJobEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'job_type', type: 'enum', enum: AiJobType })
  jobType!: AiJobType;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId!: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ type: 'enum', enum: AiJobStatus, default: AiJobStatus.PENDING })
  status!: AiJobStatus;

  @Column({ name: 'attempt_count', type: 'integer', default: 0 })
  attemptCount!: number;

  @Column({ name: 'input_payload', type: 'jsonb' })
  inputPayload!: Record<string, unknown>;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @Column({ name: 'output_result_id', type: 'uuid', nullable: true })
  outputResultId!: string | null;

  @CreateDateColumn({ name: 'queued_at', type: 'timestamptz' })
  queuedAt!: Date;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt!: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;
}
