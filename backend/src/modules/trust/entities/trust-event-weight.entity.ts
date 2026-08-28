import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TrustEventType } from '../../../common/enums';

@Entity('trust_event_weights')
export class TrustEventWeightEntity {
  @PrimaryColumn({ name: 'event_type', type: 'enum', enum: TrustEventType })
  eventType!: TrustEventType;

  @Column({ name: 'base_weight', type: 'numeric', precision: 5, scale: 2 })
  baseWeight!: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 1.0 })
  multiplier!: number;
}
