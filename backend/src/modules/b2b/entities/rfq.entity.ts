import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { RfqStatus } from '../../../common/enums';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('rfqs')
export class RfqEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'buyer_id' })
  buyer!: UserEntity;

  @Column({ type: 'text', nullable: true })
  category!: string | null;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId!: string | null;

  @Column({ name: 'required_qty', type: 'integer' })
  requiredQty!: number;

  @Column({ name: 'target_unit_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  targetUnitPrice!: number | null;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate!: Date;

  @Column({ name: 'delivery_city', type: 'text' })
  deliveryCity!: string;

  @Column({ name: 'delivery_state', type: 'text' })
  deliveryState!: string;

  @Column({ name: 'spec_notes', type: 'text', nullable: true })
  specNotes!: string | null;

  @Column({ type: 'enum', enum: RfqStatus, default: RfqStatus.OPEN })
  status!: RfqStatus;

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
