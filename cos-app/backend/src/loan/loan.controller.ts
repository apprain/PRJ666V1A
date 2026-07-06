import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoanService } from './loan.service';

import { StartLoanDto } from "./dto/start-loan.dto";
import { UpdateLoanProfileDto } from "./dto/update-loan-profile.dto";
import { ReviewLoanDto } from "./dto/review-loan.dto";

@Controller('api/loan')
export class LoanController {
    constructor(private readonly loanService: LoanService) { }

    @Post("start")
    startLoan(@Body() body: StartLoanDto) {
        return this.loanService.startLoan(
            body.tenantId,
            body.mobileNo,
        );
    }

    @Post(":leadId/profile")
    saveProfile(
        @Param("leadId") leadId: string,
        @Body() body: UpdateLoanProfileDto,
    ) {
        return this.loanService.saveLoanProfile(leadId, body);
    }

    @Get("admin/:tenantId/applications")
    findLoanApplications(
        @Param("tenantId") tenantId: string,
    ) {
        return this.loanService.findLoanApplications(tenantId);
    }

    @Post(":id/review")
    reviewApplication(
        @Param("id") id: string,
        @Body() body: ReviewLoanDto,
    ) {
        return this.loanService.reviewApplication(
            id,
            body.status
        );
    }


    // @Post(':id/review')
    // reviewApplication(
    //     @Param('id') id: string,
    //     @Body() body: { status: 'APPROVED' | 'REJECTED'; remarks?: string },
    // ) {
    //     return this.loanService.reviewApplication(id, body.status, body.remarks);
    // }


    // @Post("start")
    // startBrokerage(@Body() body: StartLoanDto) {
    //     return this.loanService.startBrokerage(
    //         body.tenantId,
    //         body.mobileNo,
    //     );
    // }


    // @Post(':leadId/profile')
    // saveProfile(
    //     @Param('leadId') leadId: string,
    //     @Body() body: UpdateLoanProfileDto,
    // ) {
    //     return this.loanService.saveLoanProfile(
    //         leadId,
    //         body,
    //     );
    // }

    // @Post(':leadId/profile')
    // saveProfile(@Param('leadId') leadId: string, @Body() body: any) {
    //     return this.loanService.saveLoanProfile(leadId, body);
    // }

    // @Get('admin/:tenantId/applications')
    // findLoanApplications(@Param('tenantId') tenantId: string) {
    //     return this.loanService.findLoanApplications(tenantId);
    // }
}