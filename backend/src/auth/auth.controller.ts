import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, password);
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
}