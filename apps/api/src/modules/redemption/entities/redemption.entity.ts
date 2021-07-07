import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Coupon } from '../../coupon/entities/coupon.entity';

@Entity()
export class Redemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  trackingId: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Coupon)
  coupon: Coupon;

  @Column({
    default: {},
    type: 'json',
  })
  metadata: Record<string, unknown>;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
