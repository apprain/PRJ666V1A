import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) { }

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
}
