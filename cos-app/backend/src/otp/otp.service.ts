import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { MobileOtp } from './entities/mobile-otp.entity';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(MobileOtp)
        private otpRepository: Repository<MobileOtp>,
    ) { }

    async sendOtp(mobileNo: string) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        const otp = this.otpRepository.create({
            mobileNo,
            otpCode,
            expiresAt,
            isVerified: false,
        });

        await this.otpRepository.save(otp);

        console.log(`COS OTP for ${mobileNo}: ${otpCode}`);

        return {
            message: 'OTP generated successfully',
            mobileNo,
            devOtp: otpCode,
        };
    }

    async verifyOtp(mobileNo: string, otpCode: string) {
        const otp = await this.otpRepository.findOne({
            where: {
                mobileNo,
                otpCode,
                isVerified: false,
                expiresAt: MoreThan(new Date()),
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (!otp) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        otp.isVerified = true;
        await this.otpRepository.save(otp);

        return {
            message: 'OTP verified successfully',
            mobileNo,
            verified: true,
        };
    }
}