import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SystemAdmin } from './system-admin.entity';

@Injectable()
export class SystemAdminService {
    constructor(
        @InjectRepository(SystemAdmin)
        private readonly systemAdminRepo: Repository<SystemAdmin>,

        private readonly jwtService: JwtService,
    ) { }

    async login(dto: any) {
        const admin = await this.systemAdminRepo.findOne({
            where: { email: dto.email },
        });

        console.log('ADMIN:', admin);

        if (!admin) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(
            dto.password,
            admin.passwordHash,
        );

        console.log('PASSWORD MATCH:', validPassword);
        console.log('INPUT PASSWORD:', dto.password);
        console.log('HASH:', admin.passwordHash);

        if (!validPassword) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: admin.id,
            email: admin.email,
            role: admin.role,
            type: 'system_admin',
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        };
    }
}