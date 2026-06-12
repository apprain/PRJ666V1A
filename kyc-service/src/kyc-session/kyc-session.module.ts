import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KycSession } from './kyc-session.entity';
import { KycSessionService } from './kyc-session.service';
import { KycDocumentService } from '../kyc-document/kyc-document.service';
import { KycSessionController } from './kyc-session.controller';
import { KycModule } from '../kyc/kyc.module';
import { ClientAppModule } from '../client-app/client-app.module';
import { KycDocument } from '../kyc-document/kyc-document.entity';
import { MinioModule } from '../kyc/minio/minio.module';
import { AwsRekognitionModule } from '../aws-rekognition/aws-rekognition.module';
import { AwsTextractModule } from '../aws-textract/aws-textract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KycSession,
      KycDocument,
    ]),
    ClientAppModule,
    MinioModule,
    KycModule,
    AwsRekognitionModule,
    AwsTextractModule,
  ],
  controllers: [KycSessionController],
  providers: [KycSessionService, KycDocumentService],
  exports: [KycSessionService],
})
export class KycSessionModule { }