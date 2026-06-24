import { Logger, Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { EnhancedHttpModule } from './enhanced-http/enhanced-http.module';
import { RequestContextModule } from '@app/modules/core/request-context/request-context.module';
// import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    SharedModule,
    EnhancedHttpModule,
    RequestContextModule,
    // SqsModule,
  ],
  providers: [Logger],
  exports: [
    Logger,
    EnhancedHttpModule,
    RequestContextModule,
    // SqsModule,
  ],
})
export class CoreModule {}
