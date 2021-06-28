import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum DiscountType {
  Amount = 'AMOUNT',
  Percent = 'PERCENT',
}

@Entity()
@Unique(['code'])
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product: string;

  @Column()
  code: string;

  @Column()
  active: boolean;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'timestamp without time zone',
  })
  startDate: Date;

  @Column({
    type: 'timestamp without time zone',
  })
  endDate: Date;

  @Column({
    enum: DiscountType,
  })
  discountType: DiscountType;

  @Column({ nullable: true })
  percentOff?: number;

  @Column({ nullable: true })
  amountOff?: number;

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
