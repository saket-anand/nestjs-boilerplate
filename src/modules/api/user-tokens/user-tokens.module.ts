import { Module } from '@nestjs/common';
import { UserTokensService } from './user-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { UserTokensRepository } from './repositories/user-tokens.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken]), JwtModule],
  providers: [UserTokensService, UserTokensRepository],
  exports: [UserTokensService],
})
export class UserTokensModule {}
