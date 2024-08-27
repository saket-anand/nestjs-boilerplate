import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('cache.host'),
            port: configService.get<number>('cache.port'),
          },
          // url: configService.get<string>('cache.host'),
          ttl: configService.get<number>('cache.ttl'),
        });
        return { store };
      },
      isGlobal: true,
    }),
  ],
})
export class CacheConfigModule {}
