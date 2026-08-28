import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { QuoteStatus } from '../../../common/enums';
import { RfqEntity } from './rfq.entity';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('quotes')
export class QuoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'rfq_id', type: 'uuid' })
  rfqId!: string;

  @ManyToOne(() => RfqEntity)
  @JoinColumn({ name: 'rfq_id' })
  rfq!: RfqEntity;

  @Column({ name: 'artisan_id', type: 'uuid' })
  artisanId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan!: UserEntity;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'integer' })
  moq!: number;

  @Column({ name: 'total_qty', type: 'integer' })
  totalQty!: number;

  @Column({ name: 'est_delivery_date', type: 'date' })
  estDeliveryDate!: Date;

  @Column({ name: 'production_notes', type: 'text', nullable: true })
  productionNotes!: string | null;

  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.PENDING })
  status!: QuoteStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
