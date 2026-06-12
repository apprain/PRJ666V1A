import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadKycData } from './entities/lead-kyc-data.entity';
import { Lead } from './entities/lead.entity';
import { LeadExtraData } from './entities/lead-extra-data.entity';

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(Lead)
        private leadRepository: Repository<Lead>,

        @InjectRepository(LeadKycData)
        private leadKycDataRepository: Repository<LeadKycData>,

        @InjectRepository(LeadExtraData)
        private leadExtraDataRepository: Repository<LeadExtraData>,
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
            verificationUrl: `${process.env.KYC_API_URL}/verify/${lead.kycSessionId}`,
        };
    }

    // async completeKyc(leadId: string) {
    //     const lead = await this.leadRepository.findOne({
    //         where: { id: leadId },
    //     });

    //     if (!lead) {
    //         throw new BadRequestException('Lead not found');
    //     }

    //     lead.leadStatus = 'PROFILE_ENRICHED';
    //     lead.kycStatus = 'COMPLETED';

    //     lead.fullName = 'Test Customer';
    //     lead.documentNumber = 'NID123456789';
    //     lead.dateOfBirth = '1990-01-01';
    //     lead.address = 'Dhaka, Bangladesh';
    //     lead.faceMatchScore = 96.5;
    //     lead.faceMatchStatus = 'matched';

    //     await this.leadRepository.save(lead);

    //     const kycData = new LeadKycData();
    //     kycData.leadId = lead.id;
    //     kycData.kycSessionId = lead.kycSessionId;
    //     kycData.extractedData = {
    //         fullName: lead.fullName,
    //         documentNumber: lead.documentNumber,
    //         dateOfBirth: lead.dateOfBirth,
    //         address: lead.address,
    //     };
    //     kycData.faceMatchScore = lead.faceMatchScore;
    //     kycData.faceMatchStatus = lead.faceMatchStatus;

    //     await this.leadKycDataRepository.save(kycData);

    //     return {
    //         message: 'KYC completed and lead profile updated',
    //         lead,
    //     };
    // }

    async findAll() {
        return this.leadRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findOne(id: string) {
        const lead = await this.leadRepository.findOne({
            where: { id },
        });

        const extraData = await this.leadExtraDataRepository.findOne({
            where: { leadId: id },
        });

        return {
            lead,
            extraData,
        };
    }

    async completeKycBySession(token: string) {
        const response = await fetch(
            `${process.env.KYC_API_URL}/api/v1/kyc/sessions/${token}/summary`,
        );

        const kycData = await response.json();
        const leadId = kycData.externalUserId;

        const lead = await this.leadRepository.findOne({
            where: { id: leadId },
        });

        if (!lead) {
            throw new BadRequestException('Lead not found for this KYC session');
        }

        const frontDoc = kycData.documents?.find(
            (doc) => doc.documentType === 'doc-front',
        );

        const backDoc = kycData.documents?.find(
            (doc) => doc.documentType === 'doc-back',
        );

        const selfieDoc = kycData.documents?.find(
            (doc) => doc.documentType === 'selfie',
        );



        lead.fullName = kycData.fullName;// || lead.fullName;
        lead.documentNumber = kycData.documentNumber;//  || lead.documentNumber;
        lead.dateOfBirth = kycData.dateOfBirth; // || lead.dateOfBirth;
        lead.address = kycData.address;// || lead.address;
        lead.faceMatchScore = kycData.faceMatchScore ?? lead.faceMatchScore;
        lead.faceMatchStatus = kycData.faceMatchStatus || lead.faceMatchStatus;

        lead.kycSessionId = kycData.sessionId;
        lead.kycStatus =
            kycData.status === 'completed' ? 'COMPLETED' : kycData.status;

        lead.leadStatus = kycData.status === 'completed' ? 'PROFILE_ENRICHED' : 'KYC_STARTED';

        await this.leadRepository.save(lead);

        let kycRecord = await this.leadKycDataRepository.findOne({
            where: { leadId: lead.id },
        });

        if (!kycRecord) {
            kycRecord = new LeadKycData();
            kycRecord.leadId = lead.id;
        }

        kycRecord.kycSessionId = kycData.sessionId;
        kycRecord.extractedData = kycData;
        kycRecord.faceMatchScore = kycData.faceMatchScore ?? null;
        kycRecord.faceMatchStatus = kycData.faceMatchStatus || null;
        kycRecord.frontImageUrl = frontDoc?.minioObjectKey || null;
        kycRecord.backImageUrl = backDoc?.minioObjectKey || null;
        kycRecord.selfieImageUrl = selfieDoc?.minioObjectKey || null;

        //console.log(kycRecord);
        await this.leadKycDataRepository.save(kycRecord);

        return {
            message: 'Lead profile updated from KYC session',
            lead,
            kycData,
        };
    }

    async startKycReal(leadId: string) {
        const lead = await this.leadRepository.findOne({
            where: { id: leadId },
        });

        if (!lead) {
            throw new BadRequestException('Lead not found');
        }

        const res = await fetch(`${process.env.KYC_API_URL}/api/v1/kyc/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': process.env.KYC_CLIENT_ID || '',
                'x-client-secret': process.env.KYC_CLIENT_SECRET || '',
            },
            body: JSON.stringify({
                externalUserId: lead.id,
                redirectUrl: process.env.KYC_CALLBACK_URL,
            }),
        });
        console.log(process.env.KYC_CALLBACK_URL);
        const data = await res.json();

        if (!res.ok) {
            throw new BadRequestException(data.message || 'Failed to start KYC');
        }

        lead.leadStatus = 'KYC_STARTED';
        lead.kycStatus = 'STARTED';
        lead.kycSessionId = data.sessionId;

        await this.leadRepository.save(lead);

        return {
            message: 'KYC started successfully',
            leadId: lead.id,
            sessionId: data.sessionId,
            verificationUrl: data.verificationUrl,
        };
    }

    async saveExtraData(leadId: string, body: any) {
        const lead = await this.leadRepository.findOne({
            where: { id: leadId },
        });

        if (!lead) {
            throw new BadRequestException('Lead not found');
        }

        lead.fullName = body.fullName || lead.fullName;
        lead.documentNumber = body.documentNumber || lead.documentNumber;
        lead.dateOfBirth = body.dateOfBirth || lead.dateOfBirth;
        lead.address = body.address || lead.address;
        lead.leadStatus = 'READY_FOR_REVIEW';

        await this.leadRepository.save(lead);

        let extra = await this.leadExtraDataRepository.findOne({
            where: { leadId: lead.id },
        });

        if (!extra) {
            extra = new LeadExtraData();
            extra.leadId = lead.id;
            extra.tenantId = lead.tenantId;
        }

        //const extra = new LeadExtraData();

        extra.data = {
            occupation: body.occupation,
            employerName: body.employerName,
            monthlyIncome: body.monthlyIncome,
            loanAmount: body.loanAmount,
            loanPurpose: body.loanPurpose,
            currentAddress: body.currentAddress,
            referenceName: body.referenceName,
            referenceMobile: body.referenceMobile,
        };

        await this.leadExtraDataRepository.save(extra);

        return {
            message: 'Lead profile completed successfully',
            lead,
            extraData: extra,
        };
    }

    async findByTenant(tenantId: string) {
        return this.leadRepository.find({
            where: { tenantId },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async getKycData(leadId: string) {
        const kycData = await this.leadKycDataRepository.findOne({
            where: { leadId },
        });

        if (!kycData) {
            throw new BadRequestException('KYC data not found');
        }

        return {
            ...kycData,
            frontImageUrl: this.buildKycFileUrl(kycData.frontImageUrl),
            backImageUrl: this.buildKycFileUrl(kycData.backImageUrl),
            selfieImageUrl: this.buildKycFileUrl(kycData.selfieImageUrl),
        };
    }

    private buildKycFileUrl(objectKey: string | null) {
        if (!objectKey) return null;

        return `${process.env.NEXT_PUBLIC_KYC_API_URL}/kyc/files/view?key=${encodeURIComponent(objectKey)}`;
    }
}