import { Module } from '@nestjs/common';
import { AwsTextractService } from './aws-textract.service';

@Module({
  providers: [AwsTextractService],
  exports: [AwsTextractService],
})
export class AwsTextractModule { }