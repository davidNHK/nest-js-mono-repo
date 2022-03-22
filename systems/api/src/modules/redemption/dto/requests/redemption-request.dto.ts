import { IsObject, IsOptional, IsString } from 'class-validator';

export class RedemptionRequestDto {
  @IsString()
  id!: string;

  @IsString()
  trackingId!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
