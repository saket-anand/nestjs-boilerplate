import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SharedModule } from '@app/modules/api/shared/shared.module';
import { TokenExtractionMiddleware } from '@common/middlewares/token-extraction/token-extraction.middleware';

@Module({
  imports: [SharedModule],
  providers: [],
  controllers: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenExtractionMiddleware).forRoutes('*');
  }
}
