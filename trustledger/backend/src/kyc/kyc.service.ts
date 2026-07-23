import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KycService {
  constructor(private readonly configService: ConfigService) {}

  async startSession(externalUserId: string) {
    const apiUrl = this.configService.get<string>('KYC_API_URL');
    const clientId = this.configService.get<string>('KYC_CLIENT_ID');
    const clientSecret = this.configService.get<string>('KYC_CLIENT_SECRET');
    const redirectUrl = this.configService.get<string>('KYC_CALLBACK_URL');


    if (!apiUrl || !clientId || !clientSecret) {
      throw new InternalServerErrorException(
        'KYC integration is not configured.',
      );
    }

    /* const res = await fetch(`${process.env.KYC_API_URL}/api/v1/kyc/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': process.env.KYC_CLIENT_ID || '',
                'x-client-secret': process.env.KYC_CLIENT_SECRET || '',
            },
            body: JSON.stringify({
                externalUserId: lead.id,
                redirectUrl: process.env.KYC_CALLBACK_URL,
            }),
        }); */

    const response = await fetch(`${apiUrl}/api/v1/kyc/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
      },
      body: JSON.stringify({
        externalUserId,
        redirectUrl,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new BadGatewayException(
        data?.message || 'Unable to create KYC session.',
      );
    }

    return data;
  }
}
