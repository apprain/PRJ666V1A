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

    async save(session: KycSession) {
        return this.kycSessionRepo.save(session);
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

    /*
    async extractDocumentText(sessionId: string) {

        const front = await this.kycDocumentRepo.findOne({
            where: {
                session: { id: sessionId },
                documentType: 'doc-front',
            },
            relations: ['session'],
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
    }*/

    async extractDocumentText(sessionId: string) {
        const front = await this.kycDocumentRepo.findOne({
            where: {
                session: { id: sessionId },
                documentType: 'doc-front',
            },
            relations: {
                session: true,
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

        const lines = (ocrResult.lines || []).map((line) => line || '');

        const documentType = front.session?.documentType || 'NID';

        const parsed = this.parseDocumentOcr(documentType, lines);
        console.log(parsed);

        front.ocrFullText = ocrResult.fullText || '';
        front.ocrLines = lines;
        front.ocrFirstName = parsed.firstName;
        front.ocrLastName = parsed.lastName;
        front.ocrDocumentNumber = parsed.documentNumber;
        front.ocrDateOfBirth = parsed.dateOfBirth
            ? new Date(parsed.dateOfBirth)
            : null;
        front.ocrCheckedAt = new Date();

        await this.kycDocumentRepo.save(front);

        return {
            ...ocrResult,
            documentType,
            extracted: {
                firstName: front.ocrFirstName,
                lastName: front.ocrLastName,
                documentNumber: front.ocrDocumentNumber,
                dateOfBirth: front.ocrDateOfBirth,
                fullName: parsed.fullName,
            },
        };
    }

    private parseDocumentOcr(documentType: string, lines: string[]) {
        if (documentType === 'NID') {
            return this.parseBangladeshNid(lines);
        }

        if (documentType === 'DRIVING_LICENSE') {
            return this.parseCanadianDriverLicense(lines);
        }

        if (documentType === 'PASSPORT') {
            return this.parseBangladeshPassport(lines);
        }

        return {
            firstName: null,
            lastName: null,
            fullName: null,
            documentNumber: null,
            dateOfBirth: null,
            address: null,
        };
    }

    private parseBangladeshPassport(lines: string[]) {
        const cleanLines = lines
            .map(line => line.trim())
            .filter(Boolean);

        const joinedText = cleanLines.join(' ');

        const passportNoMatch =
            joinedText.match(/\b[A-Z]{1,2}\d{7,9}\b/);

        const dobMatch =
            joinedText.match(/\b(?:Date of Birth|DOB)[:\s]*([0-9]{2}[-\/][0-9]{2}[-\/][0-9]{4})\b/i) ||
            joinedText.match(/\b(?:Date of Birth|DOB)[:\s]*([0-9]{4}[-\/][0-9]{2}[-\/][0-9]{2})\b/i);

        const expiryMatch =
            joinedText.match(/\b(?:Date of Expiry|Expiry Date|Expires)[:\s]*([0-9]{2}[-\/][0-9]{2}[-\/][0-9]{4})\b/i) ||
            joinedText.match(/\b(?:Date of Expiry|Expiry Date|Expires)[:\s]*([0-9]{4}[-\/][0-9]{2}[-\/][0-9]{2})\b/i);

        const surnameLine = cleanLines.find(line =>
            /^surname[:\s]/i.test(line)
        );

        const givenNameLine = cleanLines.find(line =>
            /^given name|given names[:\s]/i.test(line)
        );

        const lastName = surnameLine
            ? surnameLine.replace(/surname[:\s]*/i, '').trim()
            : null;

        const firstName = givenNameLine
            ? givenNameLine.replace(/given names?[:\s]*/i, '').trim()
            : null;

        return {
            firstName,
            lastName,
            fullName: [firstName, lastName].filter(Boolean).join(' ') || null,
            documentNumber: passportNoMatch ? passportNoMatch[0] : null,
            dateOfBirth: dobMatch ? dobMatch[1] : null,
            expiryDate: expiryMatch ? expiryMatch[1] : null,
        };
    }

    private parseCanadianDriverLicense(lines: string[]) {
        const cleanLines = lines
            .map((line) => line.trim())
            .filter(Boolean);

        const joinedText = cleanLines.join(" ");

        const normalizeDate = (value?: string | null): string | null => {
            if (!value) return null;
            return value.replace(/\//g, "-").trim();
        };

        const cleanName = (value: string): string => {
            return value
                .replace(/[^A-Z,\s'-]/gi, "")
                .replace(/\s+/g, " ")
                .trim();
        };

        // Document Number
        let documentNumber: string | null = null;

        const docMatch = joinedText.match(
            /\b[A-Z]\d{4}\s*[.\-]?\s*-?\s*\d{5}\s*[-]?\s*\d{5}\b/i,
        );

        if (docMatch) {
            documentNumber = docMatch[0]
                .replace(/\s+/g, "")
                .replace(/[.\-]/g, "")
                .toUpperCase();
        }

        // Dates
        const dateMatches =
            joinedText.match(/\b\d{4}[\/-]\d{2}[\/-]\d{2}\b/g) || [];

        let issueDate: string | null = null;
        let expiryDate: string | null = null;
        let dateOfBirth: string | null = null;

        const issueLine = cleanLines.find((line) =>
            /4a|ISS|ISSUE|ISSUEL|D[ÉE]L/i.test(line),
        );

        if (issueLine) {
            const dates =
                issueLine.match(/\b\d{4}[\/-]\d{2}[\/-]\d{2}\b/g) || [];

            issueDate = normalizeDate(dates[0]);
        }

        const expiryLine = cleanLines.find((line) =>
            /4\.?5|EXP|EXPIRY|EXPIRES/i.test(line),
        );

        if (expiryLine) {
            const dates =
                expiryLine.match(/\b\d{4}[\/-]\d{2}[\/-]\d{2}\b/g) || [];

            expiryDate = normalizeDate(dates[0]);
        }

        if (!issueDate && dateMatches.length >= 1) {
            issueDate = normalizeDate(dateMatches[0]);
        }

        if (!expiryDate && dateMatches.length >= 2) {
            expiryDate = normalizeDate(dateMatches[1]);
        }

        if (dateMatches.length >= 3) {
            dateOfBirth = normalizeDate(dateMatches[dateMatches.length - 1]);
        }

        // Name
        let firstName: string | null = null;
        let lastName: string | null = null;
        let fullName: string | null = null;

        const nameIndex = cleanLines.findIndex((line) =>
            /NAME|NOM|HAME/i.test(line),
        );

        if (nameIndex >= 0) {
            const nextLines = cleanLines
                .slice(nameIndex + 1, nameIndex + 5)
                .map(cleanName)
                .filter((line) => {
                    if (!line) return false;

                    if (
                        /CANADA|LICENCE|DRIVER|PERMIS|ADDRESS|SEX|CLASS|CATED|REST|COND|SIGNATURE/i.test(
                            line,
                        )
                    ) {
                        return false;
                    }

                    return true;
                });

            lastName = nextLines[0]?.replace(/,/g, "") || null;
            firstName = nextLines[1] || null;

            if (firstName && lastName) {
                fullName = `${firstName} ${lastName}`;
            }
        }

        // Address
        const addressLines = cleanLines.filter((line) =>
            /\d+.*(PL|ST|AVE|RD|DR|CRES|BLVD|LANE|WAY|CT)|SCARBOROUGH|TORONTO|ON/i.test(
                line,
            ),
        );

        const address = addressLines.length ? addressLines.join(", ") : null;

        return {
            firstName,
            lastName,
            fullName,
            documentNumber,
            dateOfBirth,
            issueDate,
            expiryDate,
            address,
        };
    }

    private parseBangladeshNid(lines: string[]) {
        const nameLine = lines.find((line) =>
            line.toLowerCase().includes('name:')
        );

        const dobLine = lines.find((line) =>
            line.toLowerCase().includes('date of birth')
        );

        const idLine = lines.find((line) =>
            line.toLowerCase().includes('id no')
        );

        const fullName = nameLine
            ? nameLine.replace(/name:/i, '').trim()
            : null;

        const nameParts = fullName ? fullName.split(' ') : [];

        return {
            firstName: nameParts.slice(0, -1).join(' ') || fullName,
            lastName:
                nameParts.length > 1 ? nameParts[nameParts.length - 1] : null,
            fullName,
            documentNumber: idLine
                ? idLine.replace(/id no:?/i, '').trim()
                : null,
            dateOfBirth: dobLine
                ? dobLine.replace(/date of birth:?/i, '').trim()
                : null,
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