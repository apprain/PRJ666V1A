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
  corpRegister(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body("organizationId") organizationId: string,
  ) {
    return this.authService.corpRegister(email, password, organizationId);
  }

  @Post("login")
  login(
    @Body("email") email: string,
    @Body("password") password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Post("corp-login")
  corpLogin(
    @Body("email") email: string,
    @Body("password") password: string,
  ) {
    return this.authService.corpLogin(email, password);
  }

  // @Post('login')
  // login(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.authService.login(email, password);
  // }

  // @Post('corp-login')
  // corplogin(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.authService.corplogin(email, password);
  // }

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