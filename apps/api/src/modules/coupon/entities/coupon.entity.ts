import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DiscountType } from '../constants/discount-type.constants';

@Entity()
@TableInheritance({
  column: { enum: DiscountType, name: 'discount_type', type: 'enum' },
})
@Unique(['code'])
export abstract class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product: string;

  @Column()
  code: string;

  @Column()
  active: boolean;

  @Column({
    insert: false,
    update: false,
  })
  discountType: DiscountType;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'timestamp without time zone',
  })
  startDate: Date;

  @Column({
    nullable: true,
    type: 'timestamp without time zone',
  })
  endDate?: Date;

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
