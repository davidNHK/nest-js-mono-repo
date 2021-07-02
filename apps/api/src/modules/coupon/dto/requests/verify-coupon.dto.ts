import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItem {
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

export class Order {
  @IsString()
  id: string;

  @Min(0)
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsArray()
  @Type(() => OrderItem)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @ValidateNested()
  items: OrderItem[];
}

export class Customer {
  @IsString()
  id: string;
}

export class VerifyCouponBodyDto {
  @Type(() => Customer)
  @ValidateNested()
  customer: Customer;

  @Type(() => Order)
  @ValidateNested()
  order: Order;

  @IsString()
  @IsOptional()
  trackingId?: string;
}

export class ClientVerifyCouponQueryDto {
  @Type(() => Customer)
  @ValidateNested()
  customer: Customer;

  @Type(() => Order)
  @ValidateNested()
  order: Order;
}

export class VerifyCouponParamsDto {
  @IsString()
  code: string;
}
