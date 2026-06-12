import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { KycService } from '../kyc/kyc.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KycDocument } from './kyc-document.entity';
import { KycSessionService } from '../kyc-session/kyc-session.service';
import { console } from 'inspector';

@Injectable()
export class KycDocumentService {
    constructor(
        @InjectRepository(KycDocument)
        private readonly kycDocumentRepo: Repository<KycDocument>,
        private readonly kycSessionService: KycSessionService,
        private readonly kycService: KycService,
    ) { }


    async uploadSelfieBase64(token: string, image: string, doctype: string) {
        if (!image) {
            throw new BadRequestException('image is required');
        }

        const session = await this.kycSessionService.findByToken(token);

        if (!session) {
            throw new NotFoundException('Invalid session token');
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const objectKey = `kyc/${session.id}/selfie-${Date.now()}.jpg`;

        await this.kycService.uploadBuffer(
            objectKey,
            buffer,
            'image/jpeg',
        );

        const document = this.kycDocumentRepo.create({
            session,
            documentType: doctype,
            originalFileName: 'selfie.jpg',
            minioObjectKey: objectKey,
            mimeType: 'image/jpeg',
            size: buffer.length,
            status: 'uploaded',
        });

        const saved = await this.kycDocumentRepo.save(document);

        return {
            documentId: saved.id,
            objectKey,
            status: saved.status,
        };
    }

    async uploadDocumentFrontBase64(
        token: string,
        image: string,
        doctype: string,
        documenttype: string,
    ) {

        const session = await this.kycSessionService.findByToken(token);

        if (!session) {
            throw new NotFoundException('Invalid session token');
        }
        console.log(session);
        session.documentType = documenttype;

        await this.kycSessionService.save(session);

        return this.uploadSelfieBase64(token, image, doctype);
    }

    async uploadSelfie(
        token: string,
        file: Express.Multer.File,
    ) {


        if (!file) {
            throw new BadRequestException(
                'File is required. Use form-data with key name: file',
            );
        }

        const session =
            await this.kycSessionService.findByToken(token);

        if (!session) {
            throw new NotFoundException('Invalid session token');
        }

        const objectKey =
            `kyc/${session.id}/selfie-${Date.now()}-${file.originalname}`;

        await this.kycService.uploadBuffer(
            objectKey,
            file.buffer,
            file.mimetype,
        );

        const document = this.kycDocumentRepo.create({
            session,
            documentType: 'selfie',
            originalFileName: file.originalname,
            minioObjectKey: objectKey,
            mimeType: file.mimetype,
            size: file.size,
            status: 'uploaded',
        });

        const saved =
            await this.kycDocumentRepo.save(document);

        return {
            documentId: saved.id,
            objectKey,
            status: saved.status,
        };
    }

    async findBySessionId(sessionId: string) {
        return this.kycDocumentRepo.find({
            where: {
                session: {
                    id: sessionId,
                },
            },
        });
    }
}