import { Injectable } from '@nestjs/common';
import { CommunicationService } from './interfaces/communication-service.interface';
import { EnhancedHttpService } from '../enhanced-http/enhanced-http.service';

@Injectable()
export class SMSService implements CommunicationService {
  constructor(private readonly httpService: EnhancedHttpService) {}
  async send(recipient: string, content: string, options?: any): Promise<void> {
    const response: any = await this.httpService.get(
      `https://2factor.in/API/V1/d097a8a3-b1f8-11ee-8cbb-0200cd936042/SMS/+91${recipient}/${content}/LOGIN_OTP_WARDROLL`,
    );
    if (response.Status !== 'Success') {
      console.error(`Failed to send SMS: ${JSON.stringify(response)}`);
      throw new Error('Failed to send SMS');
    }
    return response;
  }
}
