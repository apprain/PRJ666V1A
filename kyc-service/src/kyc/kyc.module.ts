import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { MinioService } from './minio/minio.service';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [KycController],
  providers: [KycService, MinioService],
  exports: [KycService],
})
export class KycModule {}