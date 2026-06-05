import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientAdminDashboardService } from './client-admin-dashboard.service';
import { ClientAdminDashboardController } from './client-admin-dashboard.controller';

import { KycSession } from '../kyc-session/kyc-session.entity';
import { KycDocument } from '../kyc-document/kyc-document.entity';
import { KycSessionModule } from '../kyc-session/kyc-session.module';
import { MinioModule } from '../kyc/minio/minio.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),

    KycSessionModule,
    MinioModule,

    TypeOrmModule.forFeature([
      KycSession,
      KycDocument,
    ]),
  ],

  controllers: [ClientAdminDashboardController],
  providers: [ClientAdminDashboardService],
  exports: [ClientAdminDashboardService],
})
export class ClientAdminDashboardModule { }