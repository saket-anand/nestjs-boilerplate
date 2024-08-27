import { registerAs } from '@nestjs/config';
import { CacheConfig } from './config.type';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from '@app/common/validations/validate-config';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.CACHE_STORE)
  @IsString()
  CACHE_STORE: string;

  @ValidateIf((envValues) => !envValues.CACHE_STORE)
  @IsString()
  CACHE_HOST: string;

  @ValidateIf((envValues) => !envValues.CACHE_STORE)
  @IsString()
  @IsOptional()
  CACHE_PORT: number;

  @ValidateIf((envValues) => !envValues.CACHE_STORE)
  @IsString()
  @IsOptional()
  CACHE_TTL: number;
}

export default registerAs<CacheConfig>('cache', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    store: process.env.CACHE_STORE,
    host: process.env.CACHE_HOST,
    port: process.env.CACHE_PORT ? parseInt(process.env.CACHE_PORT, 10) : 6379,
    ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 300,
  };
});
