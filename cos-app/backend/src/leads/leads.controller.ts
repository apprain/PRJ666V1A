import { Body, Controller, Param, Get, Post } from '@nestjs/common';
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

    @Post('complete-kyc')
    completeKyc(@Body('leadId') leadId: string) {
        return this.leadsService.completeKyc(leadId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.leadsService.findOne(id);
    }
}