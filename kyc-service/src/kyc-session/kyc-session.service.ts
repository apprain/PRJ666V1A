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

@Injectable()
export class KycSessionService {
    constructor(
        @InjectRepository(KycSession)
        private readonly kycSessionRepo: Repository<KycSession>,

        private readonly clientAppService: ClientAppService,
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
}