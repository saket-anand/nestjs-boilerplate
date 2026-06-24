import process from 'process';

export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  jwtAuthSecret?: string;
};

export type QueueConfig = {
  defaultQueue: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

export type DatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};

export type CacheConfig = {
  store?: string;
  host: string;
  port?: number;
  ttl?: number;
};

export type FileConfig = {
  driver: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsDefaultS3Url?: string;
  awsS3Region?: string;
  maxFileSize: number;
};

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  cache: CacheConfig;
  file: FileConfig;
};
