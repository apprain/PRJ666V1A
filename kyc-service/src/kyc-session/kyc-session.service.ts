import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import { KycSession } from './kyc-session.entity';
import { ClientAppService } from '../client-app/client-app.service';
import { CreateKycSessionDto } from './dto/create-kyc-session.dto';
import { MinioService } from '../kyc/minio/minio.service';
import { AwsRekognitionService } from '../aws-rekognition/aws-rekognition.service';
import { KycDocument } from '../kyc-document/kyc-document.entity';
import { AwsTextractService } from '../aws-textract/aws-textract.service';

@Injectable()
export class KycSessionService {
    constructor(
        @InjectRepository(KycSession)
        private readonly kycSessionRepo: Repository<KycSession>,

        @InjectRepository(KycDocument)
        private readonly kycDocumentRepo: Repository<KycDocument>,

        private readonly clientAppService: ClientAppService,
        private readonly minioService: MinioService,
        private readonly awsRekognitionService: AwsRekognitionService,
        private readonly awsTextractService: AwsTextractService,
    ) { }

    async create(
        clientId: string,
        clientSecret: string,
        dto: CreateKycSessionDto,
    ) {
        const clientApp =
            await this.clientAppService.findByClientId(clientId);

        if (!clientApp) {
            throw new UnauthorizedException('Invalid clientId');
        }

        const isValidSecret = await bcrypt.compare(
            clientSecret,
            clientApp.clientSecretHash,
        );

        if (!isValidSecret) {
            throw new UnauthorizedException('Invalid clientSecret');
        }

        const allowed =
            clientApp.allowedRedirectUrls.includes(dto.redirectUrl);

        if (!allowed) {
            throw new BadRequestException(
                'Redirect URL not allowed',
            );
        }

        const token = randomBytes(32).toString('hex');

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        const session = this.kycSessionRepo.create({
            clientApp,
            externalUserId: dto.externalUserId,
            redirectUrl: dto.redirectUrl,
            token,
            expiresAt,
            status: 'created',
        });

        const saved = await this.kycSessionRepo.save(session);

        return {
            sessionId: saved.id,
            token: saved.token,
            verificationUrl: `https://localhost:4000/verify/${saved.token}`,
            expiresAt: saved.expiresAt,
            status: saved.status,
        };
    }

    async findByToken(token: string) {
        return this.kycSessionRepo.findOne({
            where: { token },
            relations: {
                clientApp: true,
            },
        });
    }

    async complete(token: string) {
        const session = await this.findByToken(token);

        if (!session) {
            throw new NotFoundException('Invalid session token');
        }

        session.status = 'completed';
        session.completedAt = new Date();

        const saved = await this.kycSessionRepo.save(session);

        const redirectUrl =
            `${saved.redirectUrl}?sessionId=${saved.token}&status=${saved.status}`;

        return {
            sessionId: saved.token,
            status: saved.status,
            completedAt: saved.completedAt,
            redirectUrl,
        };
    }

    async findAllForSystemAdmin() {
        return this.kycSessionRepo.find({
            relations: {
                clientApp: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async getSessionForSystemAdmin(id: string) {
        return this.kycSessionRepo.findOne({
            where: { id },
            relations: {
                clientApp: true,
            },
        });
    }

    async reviewSession(
        id: string,
        reviewStatus: 'approved' | 'rejected',
        reviewedBy: string,
        reviewRemarks?: string,
    ) {
        const session = await this.kycSessionRepo.findOne({
            where: { id },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        session.reviewStatus = reviewStatus;
        session.reviewRemarks = reviewRemarks || null;
        session.reviewedBy = reviewedBy;
        session.reviewedAt = new Date();

        return this.kycSessionRepo.save(session);
    }

    async compareSessionFaces(sessionId: string) {
        const documents = await this.kycDocumentRepo.find({
            where: {
                session: {
                    id: sessionId,
                },
            },
        });

        // const selfie = documents.find(
        //     (d) => d.documentType === 'selfie',
        // );

        // const front = documents.find(
        //     (d) => d.documentType === 'doc-front',
        // );

        const selfie = await this.kycDocumentRepo.findOne({
            where: {
                session: { id: sessionId },
                documentType: 'selfie',
            },
            order: {
                createdAt: 'DESC',
            },
        });

        const front = await this.kycDocumentRepo.findOne({
            where: {
                session: { id: sessionId },
                documentType: 'doc-front',
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (!selfie || !front) {
            throw new Error(
                'Selfie or document front not found',
            );
        }

        const selfieBuffer =
            await this.minioService.getObjectBuffer(
                selfie.minioObjectKey
            );

        const frontBuffer =
            await this.minioService.getObjectBuffer(
                front.minioObjectKey,
            );

        // return this.awsRekognitionService.compareFaces(
        // selfieBuffer,
        // frontBuffer,
        // );

        const result = await this.awsRekognitionService.compareFaces(
            selfieBuffer,
            frontBuffer,
        );

        const session = await this.kycSessionRepo.findOne({
            where: { id: sessionId },
        });

        if (session) {
            session.faceMatchStatus = result.matched ? 'matched' : 'not_matched';
            session.faceMatchScore = result.similarity;
            session.faceMatchConfidence = result.confidence;
            session.faceCheckedAt = new Date();

            await this.kycSessionRepo.save(session);
        }

        return result;
    }

    async compareFacesByToken(token: string) {
        const session = await this.kycSessionRepo.findOne({
            where: { token },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        return this.compareSessionFaces(session.id);
    }

    async extractDocumentText(sessionId: string) {
        const front = await this.kycDocumentRepo.findOne({
            where: {
                session: { id: sessionId },
                documentType: 'doc-front',
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (!front) {
            return {
                success: false,
                reason: 'Document front not found',
                fullText: '',
                lines: [],
            };
        }

        const buffer = await this.minioService.getObjectBuffer(
            front.minioObjectKey,
        );

        const ocrResult =
            await this.awsTextractService.extractTextFromBuffer(buffer);

        const lines = (ocrResult.lines || []).map(
            (line) => line || '',
        );

        front.ocrFullText = ocrResult.fullText || '';
        front.ocrLines = lines;
        front.ocrFirstName = lines[1] || null;
        front.ocrLastName = lines[2] || null;
        front.ocrDocumentNumber = lines[3] || null;
        front.ocrCheckedAt = new Date();
        console.log(front);
        await this.kycDocumentRepo.save(front);

        return {
            ...ocrResult,
            extracted: {
                firstName: front.ocrFirstName,
                lastName: front.ocrLastName,
                documentNumber: front.ocrDocumentNumber,
            },
        };
    }

    async extractDocumentTextByToken(token: string) {
        const session = await this.kycSessionRepo.findOne({
            where: { token },
        });

        if (!session) {
            return {
                success: false,
                reason: 'Session not found',
            };
        }

        return this.extractDocumentText(session.id);
    }

    async analyzeOcr(sessionId: string) {
        const ocr = await this.extractDocumentText(sessionId);

        const lines = ocr.lines || [];

        return {
            firstName: lines[1] || null,
            lastName: lines[2] || null,
            documentNumber: lines[3] || null,
            rawText: ocr.fullText,
        };
    }
}