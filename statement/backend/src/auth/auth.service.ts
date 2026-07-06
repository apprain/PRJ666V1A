import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  private otpStore = new Map<
    string,
    {
      otp: string;
      expiresAt: number;
    }
  >();

  // async register(email: string, password: string) {

  //   const existingUser =
  //     await this.usersService.findByEmail(email);

  //   if (existingUser) {
  //     return {
  //       message: 'User already exists',
  //     };
  //   }

  //   const hashedPassword =
  //     await bcrypt.hash(password, 10);

  //   return await this.usersService.createUser(
  //     email,
  //     hashedPassword,
  //   );
  // }

  async register(
    email: string,
    password: string,
    mobile: string,
    kycSessionId: string,
  ) {
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      return {
        message: 'User already exists',
      };
    }

    const existingMobile = await this.usersService.findByMobile(mobile);

    if (existingMobile) {
      return {
        message: 'Mobile already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.createUser(
      email,
      hashedPassword,
      mobile,
      kycSessionId,
    );

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async corpregister(email: string, password: string, organizationname: string) {

    const existingUser =
      await this.usersService.findByEmail(email);

    if (existingUser) {
      return {
        message: 'User already exists',
      };
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    return await this.usersService.createCorpUser(
      email,
      hashedPassword,
      organizationname,
    );
  }

  async login(email: string, password: string) {

    const user =
      await this.usersService.findByEmail(email);

    if (!user) {
      return {
        message: 'Invalid email',
      };
    }

    const passwordMatched =
      await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return {
        message: 'Invalid password',
      };
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),
    };
  }

  async corplogin(email: string, password: string) {

    const user =
      await this.usersService.findByEmail(email);

    if (!user) {
      return {
        message: 'Invalid email',
      };
    }

    const passwordMatched =
      await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return {
        message: 'Invalid password',
      };
    }
    if (!user.organizationname) {
      return {
        message: 'Organization login is requited to download statement.',
      };
    }

    //console.log(user.organizationname);
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),
    };
  }

  async sendOtp(mobile: string) {
    const otp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    this.otpStore.set(mobile, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    return {
      success: true,
      message: 'OTP sent successfully',
      otp, // Development only
    };
  }

  async verifyOtp(
    mobile: string,
    otp: string,
  ) {
    const record = this.otpStore.get(mobile);

    if (!record) {
      return {
        success: false,
        message: 'OTP not found',
      };
    }

    if (record.expiresAt < Date.now()) {
      this.otpStore.delete(mobile);

      return {
        success: false,
        message: 'OTP expired',
      };
    }

    if (record.otp !== otp) {
      return {
        success: false,
        message: 'Invalid OTP',
      };
    }

    this.otpStore.delete(mobile);

    return {
      success: true,
      message: 'OTP verified',
    };
  }

  async checkUser(mobile: string) {
    const user =
      await this.usersService.findByMobile(mobile);

    return {
      exists: !!user,
    };
  }
}