import { Injectable } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { ProductType } from '../common/enums/product-type.enum';

@Injectable()
export class BrokerageService {
    constructor(private readonly leadsService: LeadsService) { }

    async test() {
        return {
            message: 'Brokerage module is working',
        };
    }

    async startBrokerage(tenantId: string, mobileNo: string) {
        return this.leadsService.startLead(
            tenantId,
            mobileNo,
            ProductType.BROKERAGE,
        );
    }

    async saveProfile(leadId: string, body: any) {
        return this.leadsService.saveExtraData(leadId, {
            ...body,
            productSection: 'BROKERAGE',
        });
    }

    async findBrokerageApplications(tenantId: string) {
        return this.leadsService.findApplications(
            tenantId,
            ProductType.BROKERAGE,
        );
    }

    async reviewApplication(
        id: string,
        status: 'APPROVED' | 'REJECTED',
        remarks?: string,
    ) {
        return this.leadsService.updateLeadStatus(id, status);
    }
}