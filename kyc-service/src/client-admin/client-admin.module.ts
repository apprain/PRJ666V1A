import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientAdminUser } from './client-admin.entity';
import { ClientAdminService } from './client-admin.service';
import { ClientAdminController } from './client-admin.controller';
import { ClientAppModule } from '../client-app/client-app.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientAdminUser]),
    ClientAppModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),

  ],
  controllers: [ClientAdminController],
  providers: [ClientAdminService],
})
export class ClientAdminModule { }