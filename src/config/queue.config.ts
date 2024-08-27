import { registerAs } from '@nestjs/config';
import { QueueConfig } from './config.type';
import validateConfig from '@app/common/validations/validate-config';
import { IsString } from 'class-validator';
import * as process from 'process';

class EnvironmentVariablesValidator {
  @IsString()
  ACCESS_KEY_ID: string;

  @IsString()
  SECRET_ACCESS_KEY: string;

  @IsString()
  DEFAULT_QUEUE_URL: string;

  @IsString()
  AWS_REGION: string;
}

export default registerAs<QueueConfig>('queue', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    defaultQueue: process.env.DEFAULT_QUEUE_URL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  };
});
