import {
  OTP_MAX_INVALID_ATTEMPTS_COUNT,
  OTP_MAX_RESEND_COUNT,
  OTP_VALIDITY,
} from '@app/common/constants/app.constants';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OtpStatus } from '../enums/otp.enum';
import { ExtendedBaseEntity } from '@app/common/entities/extended-base.entity';

@Entity()
export class Otp extends ExtendedBaseEntity {
  @Exclude()
  @Column({ name: 'entity_type', nullable: true })
  entityType: string;

  @ApiProperty({
    description: 'Entity Id',
  })
  @Exclude()
  @Column({ name: 'entity_id', nullable: true })
  entityId: string;

  @ApiProperty({
    description: 'Otp Id. This should be used to verify the otp',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ name: 'otp_id' })
  otpId: string;

  @Exclude()
  @Column({ name: 'otp' })
  otp: string;

  @ApiProperty({
    description: 'This is status of the otp for the given OTP Id',
    example: 'active',
    enum: OtpStatus,
    enumName: 'OtpStatus',
  })
  @Column({
    name: 'otp_status',
    type: 'enum',
    enum: OtpStatus,
    default: OtpStatus.ACTIVE,
  })
  otpStatus: OtpStatus;

  @ApiProperty({
    description: 'Validity of the OTP generated',
    example: 'active',
  })
  @Column({
    name: 'otp_valid_till',
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP + INTERVAL '15 minutes'`,
  })
  otpValidTill: Date;

  @ApiProperty({
    description: 'Count of Invalid Attempt',
    example: 0,
  })
  @Column({ name: 'invalid_attempts_count', default: 0 })
  invalidAttemptsCount: number;

  @ApiProperty({
    description: 'Maximum number of times Invalid Otp submission is allowed.',
    example: 3,
  })
  @Column({
    name: 'max_invalid_attempts_count',
    default: OTP_MAX_INVALID_ATTEMPTS_COUNT,
  })
  maxInvalidAttemptsCount: number;

  @ApiProperty({
    description: 'How many times the same otp has been (resend) to the number.',
    example: 0,
  })
  @Column({ name: 'resend_count', default: 0 })
  resendCount: number;

  @ApiProperty({
    description: 'Maximum number of times Resend Otp is allowed.',
    example: 3,
  })
  @Column({ name: 'max_resend_count', default: OTP_MAX_RESEND_COUNT })
  maxResendCount: number;

  @BeforeInsert()
  createUid() {
    this.otpId = uuid();
  }

  @BeforeInsert()
  setOtpValidity() {
    this.otpValidTill = moment().add(OTP_VALIDITY, 'seconds').toDate();
  }
}
