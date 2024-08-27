import {
  Controller,
  Post, Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileHandlerService } from '@core/file-handler/file-handler.service';
import { CdnLinkService } from '@core/file-handler/cdn-link.service';

@Controller('file-handler')
export class FileHandlerController {
  constructor(
    private readonly fileHandlerService: FileHandlerService,
    private readonly cdnLinkService: CdnLinkService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const s3Url = await this.fileHandlerService.uploadFile(file, 'tmp/');
    const cdnUrl = this.cdnLinkService.generateCdnLink(s3Url);
    return { cdnUrl };
  }

  @Post('uploadFromUrl')
  async uploadFileFromUrl(@Query() filePath: string) {
    const s3Url = await this.fileHandlerService.downloadAndUploadFile(
      filePath,
      'tmp/',
    );
    const cdnUrl = this.cdnLinkService.generateCdnLink(s3Url);
    return { cdnUrl };
  }
}
