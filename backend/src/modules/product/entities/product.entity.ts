import {
  Column, CreateDateColumn, Entity, JoinColumn,
  ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { ProductStatus } from '../../../common/enums';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'artisan_id', type: 'uuid' })
  artisanId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan!: UserEntity;

  @Column({ type: 'text' })
  title!: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn!: string | null;

  @Column({ name: 'description_hi', type: 'text', nullable: true })
  descriptionHi!: string | null;

  @Column({ type: 'text', nullable: true })
  category!: string | null;

  @Column({ type: 'text', nullable: true })
  subcategory!: string | null;

  @Column({ type: 'text', nullable: true })
  material!: string | null;

  @Column({ name: 'craft_technique', type: 'text', nullable: true })
  craftTechnique!: string | null;

  @Column({ name: 'care_instructions', type: 'text', nullable: true })
  careInstructions!: string | null;

  @Column({ type: 'text', nullable: true })
  dimensions!: string | null;

  @Column({ name: 'retail_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  retailPrice!: number | null;

  @Column({ name: 'wholesale_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  wholesalePrice!: number | null;

  @Column({ type: 'integer', nullable: true })
  moq!: number | null;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status!: ProductStatus;

  @Column({ name: 'inventory_qty', type: 'integer', default: 0 })
  inventoryQty!: number;

  @Column({ name: 'lead_time_days', type: 'integer', nullable: true })
  leadTimeDays!: number | null;

  @Column({ name: 'gi_eligible', type: 'boolean', default: false })
  giEligible!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
