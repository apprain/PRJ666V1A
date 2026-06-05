import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { MobileOtp } from './entities/mobile-otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MobileOtp])],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule { }