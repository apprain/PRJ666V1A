import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

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

  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}