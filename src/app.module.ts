import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@app/config/app.config';
import databaseConfig from '@app/config/database.config';
import { SqlConfigModule } from '@app/config/sql-config/sql-config.module';
import { ApiModule } from '@api/api.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { CoreModule } from '@core/core.module';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { CacheConfigModule } from './config/cache-config/cache-config.module';
import fileConfig from '@app/config/file.config';
import cacheConfig from '@app/config/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        fileConfig,
        cacheConfig,
        // queueConfig,
      ],
      envFilePath: [`env/.env.${process.env.NODE_ENV}`],
    }),
    SqlConfigModule,
    CacheConfigModule,
    CoreModule,
    ApiModule,
    RouterModule.register([
      {
        path: '/',
        module: ApiModule,
        children: [],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
