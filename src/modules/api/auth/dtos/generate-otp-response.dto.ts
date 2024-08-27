import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Otp } from '@api/otp/entities/otp.entity';
import { BaseResponseDto } from '@common/dtos/base-response.dto';
import { OtpStatus } from '@api/otp/enums/otp.enum';

export class GenerateOtpResponseDto extends BaseResponseDto {
  // @ApiProperty({ type: () => Otp })
  // otpEntity: Otp;

  @ApiProperty({
    description: 'Otp Id. This should be used to verify the otp',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  otpId: string;

  @ApiProperty({
    description: 'Otp Status',
    example: 'active',
  })
  @IsEnum(OtpStatus)
  otpStatus: OtpStatus;

  @ApiProperty({
    description: 'Otp Valid Till in ISO Date format',
    example: '2024-01-21T07:49:44.000Z',
  })
  @IsDate()
  otpValidTill: Date;

  @ApiProperty({
    description: 'Invalid Attempt Count',
    example: 2,
  })
  @IsNumber()
  invalidAttemptsCount: number;

  @ApiProperty({
    description: 'Max Invalid Attempt Count',
    example: 3,
  })
  @IsNumber()
  maxInvalidAttemptsCount: number;

  @ApiProperty({
    description: 'Resend Count. Currently Not In Use',
    example: 0,
  })
  @IsNumber()
  resendCount: number;

  @ApiProperty({
    description: 'Max Resend Count. Currently Not In Use',
    example: 3,
  })
  @IsNumber()
  maxResendCount: number;

  constructor(message: string, otpEntity?: Otp) {
    super(message);
    // this.otpEntity = otpEntity;
    this.otpId = otpEntity.otpId;
    this.otpStatus = otpEntity.otpStatus;
    this.otpValidTill = otpEntity.otpValidTill;
    this.invalidAttemptsCount = otpEntity.invalidAttemptsCount;
    this.maxInvalidAttemptsCount = otpEntity.maxInvalidAttemptsCount;
    this.resendCount = otpEntity.resendCount;
    this.maxResendCount = otpEntity.maxResendCount;
  }
}
