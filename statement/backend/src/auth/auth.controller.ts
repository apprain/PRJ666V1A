import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // @Post('register')
  // register(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.authService.register(email, password);
  // }

  @Post('register')
  register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('mobile') mobile: string,
    @Body('kycSessionId') kycSessionId: string,
  ) {
    return this.authService.register(email, password, mobile, kycSessionId);
  }


  @Post('corp-register')
  corpregister(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('organizationname') organizationname: string,
  ) {
    return this.authService.corpregister(email, password, organizationname);
  }

  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Post('corp-login')
  corplogin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.corplogin(email, password);
  }

  @Post('send-otp')
  sendOtp(
    @Body('mobile') mobile: string,
  ) {
    return this.authService.sendOtp(mobile);
  }

  @Post('verify-otp')
  verifyOtp(
    @Body('mobile') mobile: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.verifyOtp(mobile, otp);
  }

  @Post('check-user')
  checkUser(
    @Body('mobile') mobile: string,
  ) {
    return this.authService.checkUser(mobile);
  }
}