import { Injectable } from '@nestjs/common';
import { MinioService } from './minio/minio.service';

@Injectable()
export class KycService {
  constructor(private readonly minioService: MinioService) { }

  private base64ToFile(image: string, name: string): Express.Multer.File {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    return {
      originalname: `${name}-${Date.now()}.jpg`,
      buffer,
      size: buffer.length,
      mimetype: 'image/jpeg',
    } as Express.Multer.File;
  }

  async uploaddDocumentFront(image: string) {
    const file = this.base64ToFile(image, 'document-front');
    return this.minioService.uploadFile(file, 'document-front');
  }

  async uploadDocumentBack(image: string) {
    const file = this.base64ToFile(image, 'document-back');
    return this.minioService.uploadFile(file, 'document-back');
  }

  async uploadSelfie(file: Express.Multer.File) {
    return this.minioService.uploadFile(file, 'selfie');
  }

  async uploadNid(file: Express.Multer.File) {
    return this.minioService.uploadFile(file, 'nid');
  }

  async uploadLivenessSelfie(image: string) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const file = {
      originalname: `liveness-${Date.now()}.jpg`,
      buffer,
      size: buffer.length,
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    return this.minioService.uploadFile(file, 'liveness-selfie');
  }

  async uploadBuffer(
    objectKey: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    await this.minioService.putObject(
      process.env.MINIO_BUCKET || 'kyc-private',
      objectKey,
      buffer,
      buffer.length,
      {
        'Content-Type': mimeType,
      },
    );

    return objectKey;
  }
}
