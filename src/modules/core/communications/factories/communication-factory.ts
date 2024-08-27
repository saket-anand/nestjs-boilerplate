import { Injectable } from '@nestjs/common';
import { SMSService } from '../sms.service';
import { EmailService } from '../email.service';
import { CommunicationService } from '../interfaces/communication-service.interface';
import { ModeOfCommunication } from "../enums/mode-of-communication";

@Injectable()
export class CommunicationFactory {
  constructor(
    private smsService: SMSService,
    private emailService: EmailService, // ... any other services can be added here
  ) {}

  getService(type: ModeOfCommunication): CommunicationService {
    switch (type) {
      case ModeOfCommunication.SMS:
        return this.smsService;
      case ModeOfCommunication.EMAIL:
        return this.emailService;
      // other cases can be added as more communication types are implemented
      default:
        throw new Error('Invalid communication type');
    }
  }
}
