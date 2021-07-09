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

export class RedemptionOrderItemRequest {
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

export class RedemptionOrderRequest {
  @IsString()
  id: string;

  @Min(0)
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsArray()
  @Type(() => RedemptionOrderItemRequest)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @ValidateNested()
  items: RedemptionOrderItemRequest[];
}

export class RedemptionCustomerRequest {
  @IsString()
  id: string;
}

export class CreateRedemptionBodyDto extends PickType(RedemptionRequestDto, [
  'trackingId',
  'metadata',
] as const) {
  @Type(() => RedemptionCustomerRequest)
  @ValidateNested()
  @IsDefined()
  customer: RedemptionCustomerRequest;

  @Type(() => RedemptionOrderRequest)
  @ValidateNested()
  @IsDefined()
  order: RedemptionOrderRequest;

  @IsString()
  trackingId: string;
}

export class CreateRedemptionParamsDto {
  @IsString()
  code: string;
}
