import { Logger, Module } from '@nestjs/common';
import { FileHandlerService } from './file-handler.service';
import { CdnLinkService } from './cdn-link.service';

@Module({
  providers: [FileHandlerService, CdnLinkService, Logger],
  exports: [FileHandlerService, CdnLinkService],
})
export class FileHandlerModule {}
