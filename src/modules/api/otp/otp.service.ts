import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpGenerationService } from './otp-generation/otp-generation.service';
import { OTP_LENGTH } from '@common/constants/app.constants';
import { Otp } from './entities/otp.entity';
import { VerifyOtpDto } from '../auth/dtos/verify-otp.dto';
import { User } from '../users/entities/user.entity';
import { OtpStatus } from './enums/otp.enum';
import * as moment from 'moment';
import { OtpRepository } from './repositories/otp.repository';
import { ExceptionTitleList } from '@common/constants/exception-title-list.constants';
import { CommunicationService } from '@core/communications/communication.service';
import { ModeOfCommunication } from '@core/communications/enums/mode-of-communication';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly communicationService: CommunicationService,
  ) {}

  async processOtpForUser(user: User): Promise<Otp> {
    const otp: string = await this.generateOtp(user.phoneNumber);
    const otpEntity: Otp = await this.saveOtpForUser(otp, user);
    await this.dispatchOtpOnPhone(otp, user.phoneNumber);
    return otpEntity;
  }

  async saveOtpForUser(otp: string, user: User): Promise<Otp> {
    await this.otpRepository.update(
      { otpStatus: OtpStatus.ACTIVE, entityId: user.userId },
      { otpStatus: OtpStatus.EXPIRED },
    );
    const otpEntity: Otp = new Otp();
    otpEntity.otp = otp;
    otpEntity.entityId = user.userId;
    return await this.otpRepository.save(otpEntity);
  }

  async generateOtp(phoneNumber?: string): Promise<string> {
    let otp = OtpGenerationService.generateOtp(OTP_LENGTH);

    if (phoneNumber) {
      if (phoneNumber.match(/^20000/)) {
        otp = '123456';
      }
    }
    return otp;
  }

  public async dispatchOtpOnPhone(
    otp: string,
    phoneNumber: string,
  ): Promise<void> {
    if (phoneNumber) {
      if (!phoneNumber.match(/^20000/)) {
        await this.communicationService.sendCommunication(
          ModeOfCommunication.SMS,
          phoneNumber,
          otp,
        );
      }
    }
    return;
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { otpId, otp } = verifyOtpDto;
    let otpEntity: Otp = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.otpId = :otpId', { otpId })
      .andWhere('otp.otpValidTill > :currentDate', {
        currentDate: moment().toDate(),
      })
      .andWhere('otp.otpStatus = :otpStatus', { otpStatus: OtpStatus.ACTIVE })
      .getOne();
    if (!otpEntity) {
      throw new HttpException(
        ExceptionTitleList.InvalidRequest,
        HttpStatus.NOT_FOUND,
      );
    }
    if (otpEntity.invalidAttemptsCount >= otpEntity.maxInvalidAttemptsCount) {
      otpEntity.invalidAttemptsCount += 1;
      otpEntity.otpStatus = OtpStatus.LIMIT_EXCEEDED;
      otpEntity = await this.otpRepository.save(otpEntity);
      throw new HttpException(
        ExceptionTitleList.TooManyTries,
        HttpStatus.TOO_MANY_REQUESTS,
      ); // Throw Too many attempts exception
    }
    if (otpEntity.otpStatus !== OtpStatus.ACTIVE) {
      throw new HttpException(
        ExceptionTitleList.InvalidOTPStatus,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (otpEntity.otp !== otp) {
      otpEntity.invalidAttemptsCount += 1;
      otpEntity = await this.otpRepository.save(otpEntity);
      throw new HttpException(
        ExceptionTitleList.InvalidOTP,
        HttpStatus.UNAUTHORIZED,
      );
    }
    otpEntity.otpStatus = OtpStatus.VERIFIED;
    await this.otpRepository.save(otpEntity);
    return otpEntity;
  }
}
