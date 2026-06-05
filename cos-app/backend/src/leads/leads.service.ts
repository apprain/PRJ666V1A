import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadKycData } from './entities/lead-kyc-data.entity';
import { Lead } from './entities/lead.entity';

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(Lead)
        private leadRepository: Repository<Lead>,

        @InjectRepository(LeadKycData)
        private leadKycDataRepository: Repository<LeadKycData>,
    ) { }

    async startLead(tenantId: string, mobileNo: string) {
        if (!tenantId || !mobileNo) {
            throw new BadRequestException('tenantId and mobileNo are required');
        }

        let lead = await this.leadRepository.findOne({
            where: {
                tenantId,
                mobileNo,
            },
        });

        if (!lead) {
            lead = this.leadRepository.create({
                tenantId,
                mobileNo,
                leadStatus: 'LEAD_CREATED',
                kycStatus: 'NOT_STARTED',
            });

            await this.leadRepository.save(lead);
        }

        return {
            message: 'Lead started successfully',
            lead,
        };
    }

    async markOtpVerified(leadId: string) {
        const lead = await this.leadRepository.findOne({
            where: { id: leadId },
        });

        if (!lead) {
            throw new BadRequestException('Lead not found');
        }

        lead.leadStatus = 'OTP_VERIFIED';
        await this.leadRepository.save(lead);

        return {
            message: 'Lead OTP verified',
            lead,
        };
    }
    async startKyc(leadId: string) {
        const lead = await this.leadRepository.findOne({
            where: { id: leadId },
        });

        if (!lead) {
            throw new BadRequestException('Lead not found');
        }

        if (lead.leadStatus !== 'OTP_VERIFIED') {
            throw new BadRequestException('OTP must be verified before starting KYC');
        }

        lead.leadStatus = 'KYC_STARTED';
        lead.kycStatus = 'STARTED';
        lead.kycSessionId = `mock-session-${Date.now()}`;

        await this.leadRepository.save(lead);

        return {
            message: 'KYC started successfully',
            leadId: lead.id,
            kycSessionId: lead.kycSessionId,
            verificationUrl: `http://localhost:4000/verify/${lead.kycSessionId}`,
        };
    }

    async completeKyc(leadId: string) {
        const lead = await this.leadRepository.findOne({
            where: { id: leadId },
        });

        if (!lead) {
            throw new BadRequestException('Lead not found');
        }

        lead.leadStatus = 'PROFILE_ENRICHED';
        lead.kycStatus = 'COMPLETED';

        lead.fullName = 'Test Customer';
        lead.documentNumber = 'NID123456789';
        lead.dateOfBirth = '1990-01-01';
        lead.address = 'Dhaka, Bangladesh';
        lead.faceMatchScore = 96.5;
        lead.faceMatchStatus = 'matched';

        await this.leadRepository.save(lead);

        const kycData = new LeadKycData();
        kycData.leadId = lead.id;
        kycData.kycSessionId = lead.kycSessionId;
        kycData.extractedData = {
            fullName: lead.fullName,
            documentNumber: lead.documentNumber,
            dateOfBirth: lead.dateOfBirth,
            address: lead.address,
        };
        kycData.faceMatchScore = lead.faceMatchScore;
        kycData.faceMatchStatus = lead.faceMatchStatus;

        await this.leadKycDataRepository.save(kycData);

        return {
            message: 'KYC completed and lead profile updated',
            lead,
        };
    }

    async findOne(id: string) {
        return this.leadRepository.findOne({
            where: { id },
        });
    }
}