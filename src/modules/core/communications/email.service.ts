import { Injectable } from '@nestjs/common';
import { CommunicationService } from './interfaces/communication-service.interface';
@Injectable()
export class EmailService implements CommunicationService {
  async send(recipient: string, content: string, options?: any): Promise<void> {
    // logic to send SMS
  }
}
