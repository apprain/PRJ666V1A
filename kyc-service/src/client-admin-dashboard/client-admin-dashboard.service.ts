import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KycSession } from '../kyc-session/kyc-session.entity';
import { KycDocument } from '../kyc-document/kyc-document.entity';
import { MinioService } from '../kyc/minio/minio.service';

@Injectable()
export class ClientAdminDashboardService {
    constructor(
        @InjectRepository(KycSession)
        private readonly kycSessionRepo: Repository<KycSession>,

        @InjectRepository(KycDocument)
        private readonly kycDocumentRepo: Repository<KycDocument>,

        private readonly minioService: MinioService,
    ) { }

    async getSessions(clientAppId: string) {
        return this.kycSessionRepo.find({
            where: {
                clientApp: {
                    id: clientAppId,
                },
            },

            relations: {
                clientApp: true,
            },

            order: {
                createdAt: 'DESC',
            },
        });
    }

    async getSessionDocuments(
        sessionId: string,
        clientAppId: string,
    ) {
        const session = await this.kycSessionRepo.findOne({
            where: {
                id: sessionId,
                clientApp: {
                    id: clientAppId,
                },
            },

            relations: {
                clientApp: true,
            },
        });

        if (!session) {
            throw new Error('Session not found');
        }

        const documents =
            await this.kycDocumentRepo.find({
                where: {
                    session: {
                        id: sessionId,
                    },
                },
            });

        const result: any[] = [];

        for (const doc of documents) {
            const signedUrl =
                await this.minioService.getSignedUrl(
                    doc.minioObjectKey,
                );

            result.push({
                id: doc.id,
                type: doc.documentType,
                status: doc.status,
                signedUrl,
                ocrFullText:doc.ocrFullText
            });
        }

        return result;
    }

    async getSessionDocumentsForSystemAdmin(sessionId: string) {
        const documents = await this.kycDocumentRepo.find({
            where: {
                session: {
                    id: sessionId,
                },
            },
        });

        const result: any[] = [];

        for (const doc of documents) {
            const signedUrl = await this.minioService.getSignedUrl(
                doc.minioObjectKey,
            );

            result.push({
                id: doc.id,
                type: doc.documentType,
                status: doc.status,
                ocrFullText: doc.ocrFullText,
                signedUrl,
            });
        }

        return result;
    }
}