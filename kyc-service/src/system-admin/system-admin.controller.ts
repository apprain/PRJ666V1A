import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SystemAdminService } from './system-admin.service';
import { ClientAppService } from '../client-app/client-app.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { ClientAdminService } from '../client-admin/client-admin.service';
import { KycSessionService } from '../kyc-session/kyc-session.service';
import { ClientAdminDashboardService } from '../client-admin-dashboard/client-admin-dashboard.service';



@Controller('api/v1/system-admin')
export class SystemAdminController {
  constructor(
    private readonly systemAdminService: SystemAdminService,
    private readonly clientAppService: ClientAppService,
    private readonly clientAdminService: ClientAdminService,
    private readonly kycSessionService: KycSessionService,
    private readonly ClientAdminDashboardService: ClientAdminDashboardService,
  ) { }

  @Post('login')
  login(@Body() dto: any) {
    return this.systemAdminService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('client-apps')
  getClientApps() {
    return this.clientAppService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('client-admins')
  getClientAdmins() {
    return this.clientAdminService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('kyc-sessions')
  getKycSessions() {
    return this.kycSessionService.findAllForSystemAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Get('kyc-sessions/:id')
  getKycSession(@Param('id') id: string) {
    return this.kycSessionService.getSessionForSystemAdmin(id);
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('kyc-sessions/:id/documents')
  getKycSessionDocuments(@Param('id') id: string) {
    return this.ClientAdminDashboardService.getSessionDocumentsForSystemAdmin(id);
  }

  //getSessionDocumentsForSystemAdmin
  //getSessionDocumentsForSystemAdmin

  @UseGuards(JwtAuthGuard)
  @Post('kyc-sessions/:id/approve')
  approveSession(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.kycSessionService.reviewSession(
      id,
      'approved',
      req.user.email,
      body.remarks,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('kyc-sessions/:id/reject')
  rejectSession(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.kycSessionService.reviewSession(
      id,
      'rejected',
      req.user.email,
      body.remarks,
    );
  }
}