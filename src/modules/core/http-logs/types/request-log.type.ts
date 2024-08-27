import { RequestLogType } from '../enums/request-log-type.enum';

export type RequestLogData = {
  requestType: RequestLogType;
  method: string;
  url: string;
  requestHeaders: object;
  data?: object;
  referenceId?: string | null;
};
