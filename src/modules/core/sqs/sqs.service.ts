import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SQSClient,
  ChangeMessageVisibilityCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private sqs: SQSClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.sqs = new SQSClient({
      region: this.configService.getOrThrow('queue.region'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('queue.accessKeyId'),
        secretAccessKey: this.configService.getOrThrow('queue.secretAccessKey'),
      },
    });
  }

  public getSqsClient(): SQSClient {
    return this.sqs;
  }

  async changeMessageVisibility(
    queueUrl: string,
    receiptHandle: string,
    visibilityTimeout: number,
  ): Promise<void> {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
      VisibilityTimeout: visibilityTimeout,
    };
    const changeVisibilityCommand = new ChangeMessageVisibilityCommand(params);
    try {
      const data = await this.sqs.send(changeVisibilityCommand);
      console.log('Visibility changed successfully', data);
    } catch (error) {
      console.error('Change visibility error', error);
    }
  }

  async deleteMessage(receiptHandle: string) {
    const deleteParams = {
      QueueUrl: this.configService.getOrThrow('queue.metaWebhookQueue'),
      ReceiptHandle: receiptHandle,
    };
    const deleteMessageCommand = new DeleteMessageCommand(deleteParams);
    try {
      const data = await this.sqs.send(deleteMessageCommand);
      console.log('Message deleted successfully', data);
    } catch (error) {
      console.error('Delete error', error);
    }
  }
}
