import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { CdnLinkService } from '@core/file-handler/cdn-link.service';

@Injectable()
export class FileHandlerService {
  private s3: AWS.S3;

  constructor(
    private configService: ConfigService,
    private cdnLinkService: CdnLinkService,
    private logger: Logger,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.getOrThrow<string>('file.accessKeyId'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'file.secretAccessKey',
      ),
      region: this.configService.getOrThrow<string>('file.awsS3Region'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    bucketName?: string,
  ): Promise<string> {
    const filePath = path.endsWith('/') ? path : `${path}/`;
    const fullPath = `${filePath}${Date.now()}-${file.originalname}`;
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket:
            bucketName ||
            this.configService.getOrThrow<string>('file.defaultS3Bucket'),
          Key: fullPath,
          Body: file.buffer,
        })
        .promise();
      return uploadResult && this.cdnLinkService.generateCdnLink(fullPath);
    } catch (error) {
      console.error('Error uploading file in S3', error);
      throw error;
    }
  }

  async downloadAndUploadFile(
    url: string,
    path: string,
    bucketName?: string,
  ): Promise<string> {
    const { buffer, contentType, filename } = await this.downloadFile(url);
    const extension = this.getExtensionFromMimeType(contentType);
    let fileNameToSave = null;
    if (filename) {
      fileNameToSave = `${Date.now()}-${filename}`;
    } else {
      fileNameToSave = randomStringGenerator() + extension;
    }
    const fullPath = path + fileNameToSave;
    bucketName =
      bucketName || this.configService.get<string>('file.defaultS3Bucket');
    const uploadResult = await this.putObject(buffer, fullPath, bucketName, {
      contentType: contentType,
    });
    return uploadResult && this.cdnLinkService.generateCdnLink(fullPath);
  }

  async downloadFile(
    url: string,
  ): Promise<{ buffer: Buffer; contentType: string; filename?: string }> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || '';
    // Extracting filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename: string | undefined;
    if (contentDisposition) {
      const matches = contentDisposition.match(
        /filename\*?=['"]?(?:UTF-8'')?([^'";]+)['"]?/i,
      );
      if (matches && matches.length > 1) {
        filename = decodeURIComponent(matches[1]);
      }
    }

    // If filename is not found in Content-Disposition, infer from URL
    if (!filename) {
      // Extract filename from URL
      const urlParts = new URL(url);
      const potentialFilename = urlParts.pathname.split('/').pop();
      // Optional: Decode URI component if you expect URL encoding
      if (potentialFilename) {
        const decodedFilename = decodeURIComponent(potentialFilename);
        // Validate that it looks like a filename with an extension
        if (/\.[^./]+$/.test(decodedFilename)) {
          filename = decodedFilename;
        }
      }
    }

    return { buffer: Buffer.from(arrayBuffer), contentType, filename };
  }

  getExtensionFromMimeType(mimeType: string): string {
    const mimeTypeMap: { [key: string]: string } = {
      // Image formats
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/tiff': '.tiff',
      'image/svg+xml': '.svg',
      'image/bmp': '.bmp',
      'image/x-icon': '.ico',

      // Video formats
      'video/mp4': '.mp4',
      'video/mpeg': '.mpeg',
      'video/ogg': '.ogv',
      'video/webm': '.webm',
      'video/avi': '.avi',
      'video/quicktime': '.mov',
      'video/x-ms-wmv': '.wmv',
      'video/x-flv': '.flv',
      'video/x-matroska': '.mkv',

      // Audio formats
      'audio/mpeg': '.mp3',
      'audio/ogg': '.ogg',
      'audio/wav': '.wav',
      'audio/webm': '.weba',
      'audio/aac': '.aac',
      'audio/vnd.wav': '.wav',
      'audio/flac': '.flac',
      'audio/x-aiff': '.aif',
      'audio/midi': '.midi',

      // Document formats
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'application/rtf': '.rtf',
      'application/vnd.oasis.opendocument.text': '.odt',
      'application/vnd.oasis.opendocument.spreadsheet': '.ods',
      'application/vnd.oasis.opendocument.presentation': '.odp',

      // Other formats
      'application/zip': '.zip',
      'application/x-rar-compressed': '.rar',
      'application/x-7z-compressed': '.7z',
      'application/x-tar': '.tar',
      'application/json': '.json',
      'text/csv': '.csv',
      'text/plain': '.txt',
      'text/html': '.html',
      'text/css': '.css',
      'application/javascript': '.js',
      // add more MIME types as needed
    };
    return mimeTypeMap[mimeType] || '';
  }

  async putObject(
    buffer: Buffer,
    key: string,
    bucketName: string,
    config?: any,
  ): Promise<any> {
    try {
      return await this.s3
        .putObject({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: config.contentType || 'application/octet-stream',
        })
        .promise();
    } catch (error) {
      console.error('Error uploading file in S3', error);
      throw error;
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
          Key: fileKey,
        })
        .promise();
    } catch (error) {
      console.error('Error deleting file in S3', error);
      throw error;
    }
  }
}
