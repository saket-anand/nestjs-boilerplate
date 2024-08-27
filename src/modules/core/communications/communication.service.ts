import { Injectable } from '@nestjs/common';
import { CommunicationFactory } from './factories/communication-factory';
import { ModeOfCommunication } from './enums/mode-of-communication';

@Injectable()
export class CommunicationService {
  constructor(private communicationFactory: CommunicationFactory) {}

  async sendCommunication(
    type: ModeOfCommunication,
    recipient: string,
    content: string,
    options?: any,
  ): Promise<void> {
    const communicationService = this.communicationFactory.getService(type);
    await communicationService.send(recipient, content, options);
  }
}
