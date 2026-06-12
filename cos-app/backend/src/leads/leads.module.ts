import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Lead } from './entities/lead.entity';
import { LeadKycData } from './entities/lead-kyc-data.entity';
import { LeadExtraData } from './entities/lead-extra-data.entity';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead,
      LeadKycData,
      LeadExtraData,
    ]),
    AdminAuthModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService, TypeOrmModule],
})
export class LeadsModule { }