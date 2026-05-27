import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycModule } from '../kyc/kyc.module';

import { KycDocument } from './kyc-document.entity';
import { KycDocumentController } from './kyc-document.controller';
import { KycDocumentService } from './kyc-document.service';

import { KycSessionModule } from '../kyc-session/kyc-session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KycDocument]),
    KycSessionModule,
    KycModule,
  ],
  controllers: [KycDocumentController],
  providers: [KycDocumentService],
})
export class KycDocumentModule { }