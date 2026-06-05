import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { ClientAdminUser } from './client-admin.entity';
import { ClientAppService } from '../client-app/client-app.service';

@Injectable()
export class ClientAdminService {
    constructor(
        @InjectRepository(ClientAdminUser)
        private readonly clientAdminRepo: Repository<ClientAdminUser>,

        private readonly clientAppService: ClientAppService,

        private readonly jwtService: JwtService,
    ) { }

    async create(dto: any) {
        const clientApp =
            await this.clientAppService.findByClientId(dto.clientId);

        if (!clientApp) {
            throw new BadRequestException('Invalid clientId');
        }

        const existing = await this.clientAdminRepo.findOne({
            where: {
                email: dto.email,
            },
        });

        if (existing) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        const passwordHash = await bcrypt.hash(
            dto.password,
            10,
        );

        const admin = this.clientAdminRepo.create({
            clientApp,
            name: dto.name,
            email: dto.email,
            passwordHash,
            role: dto.role || 'owner',
            status: 'active',
        });

        const saved =
            await this.clientAdminRepo.save(admin);

        return {
            id: saved.id,
            name: saved.name,
            email: saved.email,
            role: saved.role,
            clientAppId: clientApp.id,
        };
    }

    async login(dto: any) {
        const admin = await this.clientAdminRepo.findOne({
            where: { email: dto.email },
            relations: {
                clientApp: true,
            },
        });

        if (!admin) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(
            dto.password,
            admin.passwordHash,
        );

        if (!validPassword) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: admin.id,
            email: admin.email,
            role: admin.role,
            clientAppId: admin.clientApp.id,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                clientAppId: admin.clientApp.id
            },
        };
    }
    async findAll() {
        const admins = await this.clientAdminRepo.find({
            relations: {
                clientApp: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });

        return admins.map((admin) => ({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            status: admin.status,
            createdAt: admin.createdAt,
            clientApp: {
                id: admin.clientApp.id,
                name: admin.clientApp.name,
                clientId: admin.clientApp.clientId,
            },
        }));
    }
}