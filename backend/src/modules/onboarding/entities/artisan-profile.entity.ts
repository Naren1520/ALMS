import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne,
  PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('artisan_profiles')
export class ArtisanProfileEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user!: UserEntity;

  @Column({ name: 'full_name_enc', type: 'bytea' })
  fullNameEnc!: Buffer;

  @Column({ type: 'text' })
  state!: string;

  @Column({ type: 'text' })
  district!: string;

  @Column({ name: 'primary_craft', type: 'text' })
  primaryCraft!: string;

  @Column({ type: 'boolean', default: false })
  verified!: boolean;

  @Column({ name: 'trust_score', type: 'numeric', precision: 5, scale: 2, default: 0 })
  trustScore!: number;

  @Column({ name: 'monthly_capacity', type: 'integer', nullable: true })
  monthlyCapacity!: number | null;

  @Column({ name: 'lead_time_days', type: 'integer', nullable: true })
  leadTimeDays!: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
