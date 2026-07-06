import { Injectable } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { ProductType } from '../common/enums/product-type.enum';

@Injectable()
export class LoanService {
    constructor(private readonly leadsService: LeadsService) { }

    async startLoan(tenantId: string, mobileNo: string) {
        return this.leadsService.startLead(tenantId, mobileNo, ProductType.LOAN);
    }

    async saveLoanProfile(leadId: string, body: any) {
        return this.leadsService.saveExtraData(leadId, {
            ...body,
            productSection: 'LOAN',
        });
    }

    async findLoanApplications(tenantId: string) {
        return this.leadsService.findApplications(tenantId, ProductType.LOAN);
    }

    async reviewApplication(
        id: string,
        status: 'APPROVED' | 'REJECTED',
        remarks?: string,
    ) {
        return this.leadsService.updateLeadStatus(id, status);
    }
}