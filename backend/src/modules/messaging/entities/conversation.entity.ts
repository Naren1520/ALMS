import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'artisan_id', type: 'uuid' })
  artisanId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan!: UserEntity;

  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'buyer_id' })
  buyer!: UserEntity;

  @Column({ name: 'rfq_id', type: 'uuid', nullable: true })
  rfqId!: string | null;

  @Column({ type: 'boolean', default: false })
  flagged!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
