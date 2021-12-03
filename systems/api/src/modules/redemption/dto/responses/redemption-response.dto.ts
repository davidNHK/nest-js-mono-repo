import { RedemptionState } from '@api/modules/redemption/states/redemption-stateus';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class RedemptionResponseDto {
  @Expose()
  id!: string;

  @Expose()
  customerId!: string;

  @Expose()
  trackingId!: string;

  @Expose()
  orderId!: string;

  @Expose()
  status!: RedemptionState;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt?: Date;

  @Expose()
  metadata?: Record<string, unknown>;
}
