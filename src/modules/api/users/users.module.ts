import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '@api/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './respositories/users.repository';
import { UserProfile } from '@api/users/entities/user-profile.entity';
import { SharedModule } from '../shared/shared.module';
import { UserProfileRepository } from './respositories/user-profile.repository';
import { FileHandlerModule } from '@core/file-handler/file-handler.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    SharedModule,
    FileHandlerModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UserProfileRepository,
    Logger,
  ],
  exports: [UsersService],
})
export class UsersModule {}
