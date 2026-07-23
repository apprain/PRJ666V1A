import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { KycService } from './kyc.service';

type StartKycBody = {
  externalUserId?: string;
  redirectUrl?: string;
};

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) { }

  @Post('start')
  async start(@Body() body: StartKycBody) {
    const externalUserId = body.externalUserId?.trim();
    if (!externalUserId) {
      throw new BadRequestException(
        'externalUserId and redirectUrl are required.',
      );
    }

    return this.kycService.startSession(externalUserId);
  }
}
