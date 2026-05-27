import {
    Controller,
    Get,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('api/v1/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @UseGuards(JwtAuthGuard)
    @Get('kyc/sessions')
    getSessions(@Req() req: any) {
        return this.adminService.getSessions(req.user.clientAppId);
    }

    @Get('kyc/sessions/:id/documents')
    @UseGuards(JwtAuthGuard)
    getDocuments(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        return this.adminService.getSessionDocuments(
            id,
            req.user.clientAppId,
        );
    }
}