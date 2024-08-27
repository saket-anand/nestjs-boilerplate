import { forwardRef, Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
