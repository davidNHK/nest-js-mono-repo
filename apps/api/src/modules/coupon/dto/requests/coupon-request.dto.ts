import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinDate,
  Validate,
  ValidateIf,
} from 'class-validator';

import { DiscountType } from '../../constants/discount-type.constants';
import { BeforeDate } from './validate/BeforeDate';

export class CouponRequestDto {
  @IsString()
  id!: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  product!: string;

  @IsString()
  code!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Validate(BeforeDate, ['endDate'])
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @MinDate(new Date())
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNumber()
  @Min(0)
  @ValidateIf(o => o.discountType === DiscountType.Amount)
  amountOff!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ValidateIf(o => o.discountType === DiscountType.Percent)
  percentOff!: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
