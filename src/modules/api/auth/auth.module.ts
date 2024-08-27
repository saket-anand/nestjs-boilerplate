import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { OtpModule } from '../otp/otp.module';
import { UserTokensModule } from '../user-tokens/user-tokens.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    UsersModule,
    OtpModule,
    UserTokensModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger],
})
export class AuthModule {}
