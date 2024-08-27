import { AxiosRequestConfig } from 'axios';

// Extend AxiosRequestConfig to include metadata
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  referenceId?: string;
  referenceEntity?: string;
}
