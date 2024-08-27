import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getOk(): Promise<string> {
    // const setRes = await this.cacheManager.set('hello', 'world');
    // console.log('setRes', setRes);
    const res: string = await this.cacheManager.get('hello');
    return res;
  }

  setHello(): string {
    return 'ok';
  }
}
