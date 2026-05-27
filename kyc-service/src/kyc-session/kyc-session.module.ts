import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KycSession } from './kyc-session.entity';
import { KycSessionService } from './kyc-session.service';
import { KycSessionController } from './kyc-session.controller';

import { ClientAppModule } from '../client-app/client-app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KycSession]),
    ClientAppModule,
  ],
  controllers: [KycSessionController],
  providers: [KycSessionService],

  exports: [KycSessionService],
})
export class KycSessionModule { }