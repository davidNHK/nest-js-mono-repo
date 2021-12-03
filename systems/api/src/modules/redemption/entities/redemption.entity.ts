import typeorm from 'typeorm';

import { Coupon } from '../../coupon/entities/coupon.entity';
import { RedemptionState } from '../states/redemption-stateus';

const {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} = typeorm;

@Entity()
export class Redemption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customerId!: string;

  @Column()
  trackingId!: string;

  @Column()
  orderId!: string;

  @ManyToOne(() => Coupon, coupon => coupon.code)
  @JoinColumn({ name: 'coupon_code', referencedColumnName: 'code' })
  coupon!: Coupon;

  @Column({
    default: {},
    type: 'json',
  })
  metadata!: Record<string, unknown>;

  @Column({
    enum: RedemptionState,
    nullable: false,
    type: 'enum',
  })
  status!: RedemptionState;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
