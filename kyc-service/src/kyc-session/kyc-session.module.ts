import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KycSession } from './kyc-session.entity';
import { KycSessionService } from './kyc-session.service';
import { KycSessionController } from './kyc-session.controller';

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
    AwsRekognitionModule,
    AwsTextractModule,
  ],
  controllers: [KycSessionController],
  providers: [KycSessionService],
  exports: [KycSessionService],
})
export class KycSessionModule { }