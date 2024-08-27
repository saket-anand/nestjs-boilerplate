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

  @IsString()
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
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsNumber()
  @IsOptional()
  SESSION_TOKEN_VALIDITY_IN_SEC: number;

  @IsString()
  @IsOptional()
  IS_SIGNUP_ALLOWED: string;

  @IsString()
  JWT_AUTH_SECRET: string;

  @IsString()
  CDN_BASE_URL: string;
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
    sessionDuration: process.env.SESSION_TOKEN_VALIDITY_IN_SEC || 172800,
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    isSignupAllowed: process.env.IS_SIGNUP_ALLOWED === 'true',
    jwtAuthSecret: process.env.JWT_AUTH_SECRET,
    cdnBaseUrl: process.env.CDN_BASE_URL,
  };
});
