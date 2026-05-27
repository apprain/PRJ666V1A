import {
  Controller,
  Param,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { KycDocumentService } from './kyc-document.service';

@Controller('api/v1/kyc/sessions')
export class KycDocumentController {
  constructor(
    private readonly kycDocumentService: KycDocumentService,
  ) { }

  @Post(':token/documents/selfie')
  uploadSelfie(
    @Param('token') token: string,
    @Body('image') image: string,
  ) {
    return this.kycDocumentService.uploadSelfieBase64(
      token,
      image,
      'selfie',
    );
  }

  @Post(':token/documents/front')
  uploadSelfiefront(
    @Param('token') token: string,
    @Body('image') image: string,
  ) {
    return this.kycDocumentService.uploadSelfieBase64(
      token,
      image,
      'doc-front',
    );
  }

  @Post(':token/documents/back')
  uploadSelfieback(
    @Param('token') token: string,
    @Body('image') image: string,
  ) {
    return this.kycDocumentService.uploadSelfieBase64(
      token,
      image,
      'doc-back',
    );
  }
}