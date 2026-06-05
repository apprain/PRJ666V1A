import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { SystemAdmin } from './system-admin.entity';
import { SystemAdminService } from './system-admin.service';
import { SystemAdminController } from './system-admin.controller';
import { ClientAppModule } from '../client-app/client-app.module';
import { ClientAdminModule } from '../client-admin/client-admin.module';
import { KycSessionModule } from '../kyc-session/kyc-session.module';
import { ClientAdminDashboardModule } from '../client-admin-dashboard/client-admin-dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemAdmin]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),
    ClientAppModule,
    ClientAdminModule,
    KycSessionModule,
    ClientAdminDashboardModule,
  ],
  controllers: [SystemAdminController],
  providers: [SystemAdminService],
  exports: [ClientAdminDashboardModule]
})
export class SystemAdminModule { }