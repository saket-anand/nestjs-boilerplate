import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../entities/otp.entity';

@Injectable()
export class OtpRepository extends Repository<Otp> {
  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {
    super(otpRepo.target, otpRepo.manager, otpRepo.queryRunner);
  }
}
