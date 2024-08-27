import { Logger, Module } from '@nestjs/common';
import { HttpLoggerService } from './http-logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpLogEntity } from './entities/http-log.entity';
import { RequestResponseLogRepository } from './repositories/request-response-log.repository';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([HttpLogEntity])],
  providers: [
    HttpLoggerService,
    RequestResponseLogRepository,
    LoggingInterceptor,
    Logger,
  ],
  exports: [HttpLoggerService, LoggingInterceptor],
})
export class HttpLogModule {}
