import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EnhancedHttpService } from './enhanced-http.service';

@Module({
  imports: [HttpModule],
  providers: [EnhancedHttpService, Logger],
  exports: [EnhancedHttpService],
})
export class EnhancedHttpModule {}
