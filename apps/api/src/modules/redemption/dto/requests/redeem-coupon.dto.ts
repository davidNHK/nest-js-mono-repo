import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
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

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
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
  @ValidateNested()
  items: OrderItem[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class Customer {
  @IsString()
  id: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class RedeemCouponBodyDto {
  @IsDefined()
  @Type(() => Customer)
  @ValidateNested()
  customer: Customer;

  @IsDefined()
  @Type(() => Order)
  @ValidateNested()
  order: Order;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class RedeemCouponParamsDto {
  @IsString()
  code: string;
}
