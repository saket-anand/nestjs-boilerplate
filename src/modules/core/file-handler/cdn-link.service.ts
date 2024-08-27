import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CdnLinkService {
  constructor(private configService: ConfigService) {}

  generateCdnLink(resourcePath: string): string {
    const cdnBase = this.configService.getOrThrow<string>('CDN_BASE_URL');
    return `${cdnBase}/${resourcePath}`;
  }
}
