import { Injectable } from '@nestjs/common';
import { RequestResponseLogRepository } from './repositories/request-response-log.repository';
import { RequestLogData } from './types/request-log.type';
import { HttpLogEntity } from './entities/http-log.entity';

@Injectable()
export class HttpLoggerService {
  constructor(
    private readonly requestResponseLogRepository: RequestResponseLogRepository,
  ) {}

  public async logRequest(param: RequestLogData): Promise<HttpLogEntity> {
    const logData: HttpLogEntity = new HttpLogEntity();
    logData.method = param.method;
    logData.url = param.url;
    logData.requestBody = this.convertDataToStorableFormat(param.data);
    logData.requestHeaders = param.requestHeaders;
    logData.requestTimeStamp = new Date();
    logData.responseHeaders = {};
    logData.referenceId = param.referenceId;
    logData.requestType = param.requestType;
    return this.requestResponseLogRepository.save(logData);
  }

  async logResponse(
    logData: HttpLogEntity,
    response: any, // Make it AxiosResponse | any
    responseTime?: number,
    referenceId?: string,
    referenceEntity?: string,
  ): Promise<HttpLogEntity> {
    // ): Promise<void> {
    logData.responseStatusCode = response?.status;
    logData.responseHeaders = response?.headers;
    logData.responseTimeStamp = new Date();
    logData.responseBody = response?.data;
    logData.responseTime = responseTime;
    logData.referenceId = referenceId;
    if (response?.status < 200 || response?.status >= 300) {
      logData.errorCode = response?.status;
    }
    return this.requestResponseLogRepository.save(logData);
  }

  private convertDataToStorableFormat(data: any): any {
    if (typeof data === 'object' && !(data instanceof FormData)) {
      // Object but not FormData, convert to JSON
      return data;
    } else if (data instanceof FormData) {
      // Handle FormData case here, possibly convert to a JSON object
      // This requires iterating over the FormData fields and building a JSON object
      const object: any = {};
      data.forEach((value, key) => (object[key] = value));
      return object;
    }
    // If it's a string or other format that can be directly stored, return as is
    return data;
  }
}
