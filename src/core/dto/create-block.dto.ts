import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  index: number;
  @ApiProperty()
  @IsNumber()
  timestamp?: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  previousHash?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  data: string;
  @ApiProperty()
  @IsString()
  nonce?: number;
}
