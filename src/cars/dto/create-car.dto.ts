import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCarDto {
  @ApiProperty()
  @IsString()
  brand: string;
  @ApiProperty()
  @IsString()
  model: string;
  @ApiProperty()
  @IsString()
  surname?: string;
}
