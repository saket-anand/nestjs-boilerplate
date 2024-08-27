import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EnhancedHttpService } from './enhanced-http.service';
import { HttpLogModule } from '../http-logs/http-log.module';

@Module({
  imports: [HttpModule, HttpLogModule],
  providers: [EnhancedHttpService, Logger],
  exports: [EnhancedHttpService],
})
export class EnhancedHttpModule {}
