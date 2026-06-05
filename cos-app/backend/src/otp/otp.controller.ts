import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('api/otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) { }

    @Post('send')
    sendOtp(@Body('mobileNo') mobileNo: string) {
        return this.otpService.sendOtp(mobileNo);
    }

    @Post('verify')
    verifyOtp(
        @Body('mobileNo') mobileNo: string,
        @Body('otpCode') otpCode: string,
    ) {
        return this.otpService.verifyOtp(mobileNo, otpCode);
    }
}