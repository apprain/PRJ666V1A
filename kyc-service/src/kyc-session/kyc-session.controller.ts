import {
    Get,
    Param,
    Body,
    Controller,
    Headers,
    Post,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';

import { KycSessionService } from './kyc-session.service';
import { CreateKycSessionDto } from './dto/create-kyc-session.dto';

@Controller('api/v1/kyc/sessions')
export class KycSessionController {
    constructor(private readonly kycSessionService: KycSessionService) { }

    @Post()
    create(
        @Headers('x-client-id') clientId: string,
        @Headers('x-client-secret') clientSecret: string,
        @Body() dto: CreateKycSessionDto,
    ) {
        if (!clientId || !clientSecret) {
            throw new BadRequestException(
                'x-client-id and x-client-secret headers are required',
            );
        }

        return this.kycSessionService.create(clientId, clientSecret, dto);
    }

    @Get(':token')
    async verify(@Param('token') token: string) {
        const session = await this.kycSessionService.findByToken(token);

        if (!session) {
            throw new NotFoundException('Invalid token');
        }

        return {
            sessionId: session.id,
            status: session.status,
            externalUserId: session.externalUserId,
            expiresAt: session.expiresAt,
        };
    }

    @Get(':token/complete')
    complete(@Param('token') token: string) {
        return this.kycSessionService.complete(token);
    }

    @Post(':id/face-check')
    faceCheck(@Param('id') id: string) {
        return this.kycSessionService.compareSessionFaces(id);
    }
    //https://localhost:4000/api/v1/kyc/sessions/1c5396ff95ed2e8dafd44c3d9f1c98cbf1527b601d73180f39d0412469aeb4e1/face-check-by-token
    @Post(':token/face-check-by-token')
    faceCheckByToken(
        @Param('token') token: string,
    ) {
        return this.kycSessionService.compareFacesByToken(token);
    }

    @Post(':id/ocr')
    extractOcr(@Param('id') id: string) {
        return this.kycSessionService.extractDocumentText(id);
    }

    @Post(':token/ocr-by-token')
    extractOcrByToken(
        @Param('token') token: string,
    ) {
        return this.kycSessionService.extractDocumentTextByToken(token);
    }

    @Post(':id/ocr-analyze')
    analyzeOcr(@Param('id') id: string) {
        return this.kycSessionService.analyzeOcr(id);
    }
}