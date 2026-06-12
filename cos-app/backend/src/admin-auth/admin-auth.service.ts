import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AdminUser } from './admin-user.entity';

@Injectable()
export class AdminAuthService {
    constructor(
        @InjectRepository(AdminUser)
        private adminUserRepository: Repository<AdminUser>,

        private jwtService: JwtService,
    ) { }

    async login(email: string, password: string) {
        const user = await this.adminUserRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException('Invalid email or password');
        }

        const matched = await bcrypt.compare(password, user.passwordHash);

        if (!matched) {
            throw new BadRequestException('Invalid email or password');
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            tenantId: user.tenantId,
            email: user.email,
            role: user.role,
        });

        return {
            accessToken,
            tenantId: user.tenantId,
            role: user.role,
            email: user.email,
        };
    }
}