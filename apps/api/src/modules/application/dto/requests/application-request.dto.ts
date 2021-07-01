import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class ApplicationRequestDto {
  @IsUUID(4)
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @IsUUID(4, { each: true })
  @ArrayMinSize(1)
  serverSecretKey: string[];

  @IsArray()
  @IsUUID(4, { each: true })
  @ArrayMinSize(1)
  clientSecretKey: string[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsOptional()
  origins?: string[];
}
