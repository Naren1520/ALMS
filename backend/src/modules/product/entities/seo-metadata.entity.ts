import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('seo_metadata')
export class SeoMetadataEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'product_id', type: 'uuid', unique: true })
  productId!: string;

  @OneToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ name: 'meta_title', type: 'text', nullable: true })
  metaTitle!: string | null;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription!: string | null;

  @Column({ name: 'og_title', type: 'text', nullable: true })
  ogTitle!: string | null;

  @Column({ name: 'og_description', type: 'text', nullable: true })
  ogDescription!: string | null;

  @Column({ name: 'canonical_slug', type: 'text', unique: true, nullable: true })
  canonicalSlug!: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  hashtags!: string[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  keywords!: string[] | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
