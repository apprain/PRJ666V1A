import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrokerageService } from './brokerage.service';
import { StartBrokerageDto } from "./dto/start-brokerage.dto";
import { UpdateBrokerageProfileDto } from "./dto/update-brokerage-profile.dto";
import { ReviewBrokerageDto } from "./dto/review-brokerage.dto";

@Controller('api/brokerage')
export class BrokerageController {
    constructor(private readonly brokerageService: BrokerageService) { }

    @Get('test')
    test() {
        return this.brokerageService.test();
    }

    @Post("start")
    startBrokerage(@Body() body: StartBrokerageDto) {
        return this.brokerageService.startBrokerage(
            body.tenantId,
            body.mobileNo,
        );
    }

    @Post(":leadId/profile")
    saveProfile(
        @Param("leadId") leadId: string,
        @Body() body: UpdateBrokerageProfileDto,
    ) {
        return this.brokerageService.saveProfile(leadId, body);
    }

    @Get("admin/:tenantId/applications")
    findBrokerageApplications(
        @Param("tenantId") tenantId: string,
    ) {
        return this.brokerageService.findBrokerageApplications(tenantId);
    }

    @Post(":id/review")
    reviewApplication(
        @Param("id") id: string,
        @Body() body: ReviewBrokerageDto,
    ) {
        return this.brokerageService.reviewApplication(
            id,
            body.status,
            body.remarks,
        );
    }
}