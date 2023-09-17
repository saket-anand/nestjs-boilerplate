import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import appConfig from '@app/config/app.config';
import fileConfig from '@app/config/file.config';
import databaseConfig from '@app/config/database.config';
import { SqlConfigModule } from '@app/config/sql-config/sql-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        // fileConfig,
      ],
      envFilePath: [`env/.env.${process.env.NODE_ENV}`],
    }),
    CacheModule.register(),
    SqlConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
