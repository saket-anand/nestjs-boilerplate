import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';
import validateConfig from '@app/common/validations/validate-config';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import * as process from 'process';

enum Environment {
  Development = 'dev',
  Staging = 'stg',
  Production = 'prod',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsNumber()
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  JWT_AUTH_SECRET: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 5000,
    apiPrefix: process.env.API_PREFIX || 'api',
    jwtAuthSecret: process.env.JWT_AUTH_SECRET,
  };
});
