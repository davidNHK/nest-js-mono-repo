import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
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
  trackingId: string;
}

export class ClientVerifyCouponBodyDto {
  @Type(() => Customer)
  @ValidateNested()
  @IsDefined()
  customer: Customer;

  @Type(() => Order)
  @ValidateNested()
  @IsDefined()
  order: Order;
}

export class VerifyCouponParamsDto {
  @IsString()
  code: string;
}
