import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('api/admin')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) { }

    @Post('login')
    login(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.adminAuthService.login(email, password);
    }
}