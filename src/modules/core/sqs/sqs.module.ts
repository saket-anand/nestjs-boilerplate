import { Logger, Module } from '@nestjs/common';
import { SqsService } from './sqs.service';

@Module({
  providers: [SqsService, Logger],
  exports: [SqsService],
})
export class SqsModule {}
