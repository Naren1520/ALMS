import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { VerificationStatus } from '../../../common/enums';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('artisan_verifications')
export class ArtisanVerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'artisan_id', type: 'uuid' })
  artisanId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan!: UserEntity;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status!: VerificationStatus;

  @Column({ name: 'document_key', type: 'text', nullable: true })
  documentKey!: string | null;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy!: string | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason!: string | null;

  @CreateDateColumn({ name: 'submitted_at', type: 'timestamptz' })
  submittedAt!: Date;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt!: Date | null;
}
