import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpRepository } from './repositories/otp.repository';
import { CommunicationModule } from '@core/communications/communication.module';

@Module({
  imports: [TypeOrmModule.forFeature([Otp]), CommunicationModule],
  providers: [OtpService, OtpRepository],
  exports: [OtpService],
})
export class OtpModule {}
