import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { HttpLoggerService } from '../http-logs/http-logger.service';
import { firstValueFrom } from 'rxjs';
import { AxiosInstance, AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { CustomAxiosRequestConfig } from './interfaces/custom-axios-request-config.interface';
import * as JSONbig from 'json-bigint';

@Injectable()
export class EnhancedHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly httpLoggerService: HttpLoggerService,
    private readonly logger: Logger,
  ) {
    const axios: AxiosInstance = this.httpService.axiosRef;
    // axios.defaults.httpAgent = new http.Agent({ family: 4 });
    // axios.defaults.httpsAgent = new https.Agent({ family: 4 });

    let logData;

    // axios.interceptors.request.use(
    //   async (config) => {
    //     const referenceId = config.headers['X-Reference-Id'];
    //     // Log the request here
    //     const reqLogData: RequestLogData = {
    //       requestType: RequestLogType.EXTERNAL,
    //       method: config.method.toUpperCase(),
    //       url: config.url,
    //       requestHeaders: config.headers,
    //       data: config.data,
    //       referenceId: referenceId,
    //     };
    //     logData = await this.httpLoggerService.logRequest(reqLogData);
    //
    //     delete config.headers['X-Reference-Id'];
    //
    //     return config;
    //   },
    //   async (error) => {
    //     console.error('Error occurred in sending request', error);
    //     // Handle the request error here
    //     return Promise.reject(error);
    //   },
    // );

    // axios.interceptors.response.use(
    //   async (response) => {
    //     // Log the response here
    //     await this.httpLoggerService.logResponse(logData, response);
    //     return response;
    //   },
    //   async (error) => {
    //     await this.httpLoggerService.logResponse(logData, error.response);
    //     console.error('Error occurred in receiving response', error);
    //     // Handle the response error here
    //     return Promise.reject(error);
    //   },
    // );
  }

  public request<T>(config?: CustomAxiosRequestConfig): Promise<T> {
    // Ensure config is an object if it's undefined
    config = config || {};

    // Ensure config.headers is an object if it's undefined
    config.headers = config.headers || {};

    // Only set the 'X-Reference-Id' if referenceId is provided
    if (config.referenceId) {
      config.headers['X-Reference-Id'] = config.referenceId;
    }

    return firstValueFrom(
      this.httpService
        .request<T>(config)
        .pipe(map((axiosResponse: AxiosResponse<T>) => axiosResponse.data)),
    );
  }
  public get<T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    // Ensure config is an object if it's undefined
    config = config || {};

    // Ensure config.headers is an object if it's undefined
    config.headers = config.headers || {};

    // Only set the 'X-Reference-Id' if referenceId is provided
    if (config.referenceId) {
      config.headers['X-Reference-Id'] = config.referenceId;
    }

    if (!config.responseType || config.responseType === 'json') {
      config.transformResponse = [
        (data, headers) => {
          // Check content type to determine if the response should be parsed as JSON
          if (headers['content-type']?.includes('application/json')) {
            return JSONbig({ storeAsString: true }).parse(data);
          }
          return data; // Return raw data for non-JSON responses
        },
      ];
    }

    return firstValueFrom(
      this.httpService.get<T>(url, config).pipe(
        map((axiosResponse: AxiosResponse<T>) => {
          console.log('axiosResponse', axiosResponse.data);
          return axiosResponse.data;
        }),
      ),
    );
  }

  public post<T>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig,
  ): Promise<T> {
    // Ensure config is an object if it's undefined
    config = config || {};

    // Ensure config.headers is an object if it's undefined
    config.headers = config.headers || {};

    // Only set the 'X-Reference-Id' if referenceId is provided
    if (config.referenceId) {
      config.headers['X-Reference-Id'] = config.referenceId;
    }

    if (!config.responseType || config.responseType === 'json') {
      config.transformResponse = [
        (data, headers) => {
          // Check content type to determine if the response should be parsed as JSON
          if (headers['content-type']?.includes('application/json')) {
            return JSONbig({ storeAsString: true }).parse(data);
          }
          return data; // Return raw data for non-JSON responses
        },
      ];
    }

    return firstValueFrom(
      this.httpService.post<T>(url, data, config).pipe(
        map((axiosResponse: AxiosResponse<T>) => {
          console.log('axiosResponse', axiosResponse.data);
          return axiosResponse.data;
        }),
      ),
    );
  }
}
