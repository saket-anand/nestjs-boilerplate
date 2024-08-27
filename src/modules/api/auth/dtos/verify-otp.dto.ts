import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { OTP_LENGTH } from '@common/constants/app.constants';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'The otpId sent in response of generate otp.' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  otpId: string;

  @ApiProperty({ description: 'The otp sent on the mobile number.' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(OTP_LENGTH)
  otp: string;
}
