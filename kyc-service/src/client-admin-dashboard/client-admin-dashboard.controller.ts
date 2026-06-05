import {
    Controller,
    Get,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';

import { ClientAdminDashboardService } from './client-admin-dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('api/v1/admin')
export class ClientAdminDashboardController {
    constructor(private readonly ClientAdminDashboardService: ClientAdminDashboardService) { }

    @UseGuards(JwtAuthGuard)
    @Get('kyc/sessions')
    getSessions(@Req() req: any) {
        return this.ClientAdminDashboardService.getSessions(req.user.clientAppId);
    }

    @Get('kyc/sessions/:id/documents')
    @UseGuards(JwtAuthGuard)
    getDocuments(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        return this.ClientAdminDashboardService.getSessionDocuments(
            id,
            req.user.clientAppId,
        );
    }
}