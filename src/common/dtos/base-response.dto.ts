import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BaseResponseDto {
  @ApiProperty({
    example: 'Successful',
  })
  @IsString()
  message: string;

  constructor(message?: string) {
    this.message = message || 'Successful';
  }
}
