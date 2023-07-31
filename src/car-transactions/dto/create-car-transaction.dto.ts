import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

class Power {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  engine: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  hp: number;
}

export class CreateCarTransactionDto {
  @ApiProperty()
  carRef: string;
  @ApiProperty()
  mileage: string;
  @ApiProperty()
  consumption: string;
  @IsString()
  maintenance?: string;
  @ApiProperty()
  @IsString()
  system?: string;
  @ApiProperty()
  @IsString()
  local?: string;
  @ApiProperty()
  @IsString()
  power?: Power;
}
