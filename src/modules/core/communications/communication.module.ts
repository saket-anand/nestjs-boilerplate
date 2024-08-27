import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { SMSService } from './sms.service';
import { EmailService } from './email.service';
import { CommunicationFactory } from './factories/communication-factory';
import { EnhancedHttpModule } from '../enhanced-http/enhanced-http.module';

@Module({
  imports: [EnhancedHttpModule],
  providers: [
    CommunicationService,
    SMSService,
    EmailService,
    CommunicationFactory,
  ],
  exports: [CommunicationService],
})
export class CommunicationModule {}
