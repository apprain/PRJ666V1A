import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';
import { JwtAuthGuard } from '../admin-auth/jwt-auth.guard';
import { LeadsService } from './leads.service';

@Controller('api/leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post('start')
    startLead(
        @Body('tenantId') tenantId: string,
        @Body('mobileNo') mobileNo: string,
    ) {
        return this.leadsService.startLead(tenantId, mobileNo);
    }

    @Post('mark-otp-verified')
    markOtpVerified(@Body('leadId') leadId: string) {
        return this.leadsService.markOtpVerified(leadId);
    }

    @Post('start-kyc')
    startKyc(@Body('leadId') leadId: string) {
        return this.leadsService.startKyc(leadId);
    }

    // @Post('complete-kyc')
    // completeKyc(@Body('leadId') leadId: string) {
    //     return this.leadsService.completeKyc(leadId);
    // }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.leadsService.findOne(id);
    }

    @Get()
    findAll() {
        return this.leadsService.findAll();
    }

    @Post('complete-kyc-by-session')
    completeKycBySession(
        @Body('sessionId') sessionId: string,
        @Body('status') status: string,
    ) {
        console.log(status);
        return this.leadsService.completeKycBySession(sessionId);
    }

    @Post('start-kyc-real')
    startKycReal(@Body('leadId') leadId: string) {
        return this.leadsService.startKycReal(leadId);
    }

    @Post(':id/extra-data')
    saveExtraData(
        @Param('id') id: string,
        @Body() body: any,
    ) {
        return this.leadsService.saveExtraData(id, body);
    }

    @Get('tenant/:tenantId')
    //@UseGuards(JwtAuthGuard)
    findByTenant(@Param('tenantId') tenantId: string) {
        return this.leadsService.findByTenant(tenantId);
    }

    @Get(':id/kyc-data')
    getKycData(@Param('id') id: string) {
        return this.leadsService.getKycData(id);
    }
}