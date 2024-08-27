import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateOtpRequestDto {
  @ApiProperty({ description: 'The phone number of the user.' })
  @IsString()
  @Length(10, 10)
  phoneNumber: string;
}
