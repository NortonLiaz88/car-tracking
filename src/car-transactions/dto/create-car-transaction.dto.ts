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
  power?: Power;
  @ApiProperty()
  @IsString()
  consumption?: string;
  @ApiProperty()
  @IsNumber()
  mileage?: string;
  @ApiProperty()
  maintenance?: any;
}
