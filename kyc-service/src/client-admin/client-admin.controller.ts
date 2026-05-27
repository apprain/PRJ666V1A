import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import { ClientAdminService } from './client-admin.service';

@Controller('api/v1/client-admins')
export class ClientAdminController {
    constructor(
        private readonly clientAdminService: ClientAdminService,
    ) { }

    @Post()
    create(@Body() dto: any) {
        return this.clientAdminService.create(dto);
    }

    @Post('login')
    login(@Body() dto: any) {
        return this.clientAdminService.login(dto);
    }
}