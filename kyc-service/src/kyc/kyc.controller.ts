import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MinioService } from './minio/minio.service';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly minioService: MinioService,
  ) { }

  @Post('upload-liveness-selfie')
  async uploadLivenessSelfie(@Body('image') image: string) {
    if (!image) {
      throw new BadRequestException(
        'File is required. Use form-data with key name: file',
      );
    }
    return this.kycService.uploadLivenessSelfie(image);
  }
  @Post('upload-document-front')
  uploadNidFront(@Body('image') image: string) {
    if (!image) {
      throw new BadRequestException(
        'Image is required'
      );
    }
    return this.kycService.uploaddDocumentFront(image);
  }

  @Post('upload-document-back')
  uploadNidBack(@Body('image') image: string) {
    if (!image) throw new BadRequestException('Image is required');
    return this.kycService.uploadDocumentBack(image);
  }
  @Post('upload-selfie')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadSelfie(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'File is required. Use form-data with key name: file',
      );
    }
    return this.kycService.uploadSelfie(file);
  }

  @Post('upload-nid')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadNid(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'File is required. Use form-data with key name: file',
      );
    }
    return this.kycService.uploadNid(file);
  }

  @Get('files/view')
  async viewFile(
    @Query('key') key: string,
    @Res() res: Response,
  ) {
    try {
      const objectKey = decodeURIComponent(key);
      const stream = await this.minioService.getObject(objectKey);
      res.setHeader('Content-Type', 'image/jpeg');
      return stream.pipe(res);
    } catch (error) {
      console.error('MinIO view file error:', error);
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}
