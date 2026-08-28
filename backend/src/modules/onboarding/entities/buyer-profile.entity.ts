import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('buyer_profiles')
export class BuyerProfileEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user!: UserEntity;

  @Column({ name: 'company_name', type: 'text' })
  companyName!: string;

  @Column({ name: 'gst_number_enc', type: 'bytea' })
  gstNumberEnc!: Buffer;

  @Column({ name: 'registered_address_enc', type: 'bytea' })
  registeredAddressEnc!: Buffer;

  @Column({ name: 'business_category', type: 'text' })
  businessCategory!: string;

  @Column({ name: 'annual_volume_inr', type: 'numeric', nullable: true })
  annualVolumeInr!: number | null;

  @Column({ type: 'boolean', default: false })
  verified!: boolean;

  @Column({ name: 'trust_score', type: 'numeric', precision: 5, scale: 2, default: 0 })
  trustScore!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
