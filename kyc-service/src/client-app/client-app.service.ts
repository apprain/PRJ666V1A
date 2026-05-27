import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ClientApp } from './client-app.entity';
import { CreateClientAppDto } from './dto/create-client-app.dto';

@Injectable()
export class ClientAppService {
    constructor(
        @InjectRepository(ClientApp)
        private readonly clientAppRepo: Repository<ClientApp>,
    ) { }

    async create(dto: CreateClientAppDto) {
        const clientId = `app_${randomBytes(12).toString('hex')}`;
        const clientSecret = `secret_${randomBytes(24).toString('hex')}`;

        const clientSecretHash = await bcrypt.hash(clientSecret, 10);

        const app = this.clientAppRepo.create({
            name: dto.name,
            clientId,
            clientSecretHash,
            allowedRedirectUrls: dto.allowedRedirectUrls,
            webhookUrl: dto.webhookUrl,
            status: 'active',
        });

        const saved = await this.clientAppRepo.save(app);

        return {
            id: saved.id,
            name: saved.name,
            clientId,
            clientSecret,
            allowedRedirectUrls: saved.allowedRedirectUrls,
            webhookUrl: saved.webhookUrl,
        };
    }

    async findByClientId(clientId: string) {
        return this.clientAppRepo.findOne({ where: { clientId } });
    }
}