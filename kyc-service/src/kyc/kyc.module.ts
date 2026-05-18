import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { MinioService } from './minio/minio.service';

@Module({
  controllers: [KycController],
  providers: [KycService, MinioService],
  exports: [KycService],
})
export class KycModule {}