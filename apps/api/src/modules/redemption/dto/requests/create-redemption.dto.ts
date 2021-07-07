import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { RedemptionRequestDto } from './redemption-request.dto';

export class RedemptionOrderItem {
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsString()
  productId: string;

  @Min(1)
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}

export class RedemptionOrder {
  @IsString()
  id: string;

  @Min(0)
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsArray()
  @Type(() => RedemptionOrderItem)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @ValidateNested()
  items: RedemptionOrderItem[];
}

export class RedemptionCustomer {
  @IsString()
  id: string;
}

export class CreateRedemptionBodyDto extends PickType(RedemptionRequestDto, [
  'trackingId',
  'metadata',
] as const) {
  @Type(() => RedemptionCustomer)
  @ValidateNested()
  @IsDefined()
  customer: RedemptionCustomer;

  @Type(() => RedemptionOrder)
  @ValidateNested()
  @IsDefined()
  order: RedemptionOrder;
}

export class CreateRedemptionParamsDto {
  @IsString()
  code: string;
}
