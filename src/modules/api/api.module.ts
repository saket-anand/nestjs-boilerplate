import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from '@app/modules/api/users/users.module';
import { SharedModule } from '@app/modules/api/shared/shared.module';
import { AuthModule } from '@app/modules/api/auth/auth.module';
import { UserTokensModule } from '@app/modules/api/user-tokens/user-tokens.module';
import { TokenExtractionMiddleware } from '@common/middlewares/token-extraction/token-extraction.middleware';
import { FileHandlerController } from './file-handler/file-handler.controller';
import { FileHandlerModule } from '@core/file-handler/file-handler.module';

@Module({
  imports: [
    UsersModule,
    UserTokensModule,
    AuthModule,
    SharedModule,
    FileHandlerModule,
  ],
  providers: [],
  controllers: [FileHandlerController],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    // Extraction Logic is run on all route, but it's validated only in AuthGuard
    consumer.apply(TokenExtractionMiddleware).forRoutes('*');
    // consumer.apply(TokenExtractionMiddleware).forRoutes(UsersController);
  }
}
