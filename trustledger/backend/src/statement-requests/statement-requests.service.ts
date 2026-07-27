import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../users/user.entity";
import { StatementRequest } from "./statement-request.entity";
import { CreateStatementRequestDto } from "./dto/create-statement-request.dto";

@Injectable()
export class StatementRequestsService {
    constructor(
        @InjectRepository(StatementRequest)
        private readonly statementRequestRepo: Repository<StatementRequest>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(
        dto: CreateStatementRequestDto,
        requestedByUserId: number,
        consentDocument?: Express.Multer.File,
    ) {
        if (!dto) {
            throw new BadRequestException(
                "Statement request data is missing.",
            );
        }

        if (!dto.startDate || !dto.endDate) {
            throw new BadRequestException(
                "Statement start date and end date are required.",
            );
        }

        const user = await this.userRepo.findOne({
            where: {
                id: requestedByUserId,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        if (!user.organizationId) {
            throw new BadRequestException(
                "Only organization users can request statements.",
            );
        }

        if (new Date(dto.startDate) > new Date(dto.endDate)) {
            throw new BadRequestException(
                "The end date must be after the start date.",
            );
        }

        const expiresAt = new Date(`${dto.expiresAt}T23:59:59.999`);

        if (Number.isNaN(expiresAt.getTime())) {
            throw new BadRequestException(
                "A valid request expiry date is required.",
            );
        }

        const request = this.statementRequestRepo.create({
            requestingOrganizationId: user.organizationId,
            requestedByUserId: user.id,
            sourceBankName: dto.sourceBankName,
            customerName: dto.customerName,
            customerMobile: dto.customerMobile,
            accountNumber: dto.accountNumber,
            startDate: dto.startDate,
            endDate: dto.endDate,
            purpose: dto.purpose,
            notes: dto.notes,
            expiresAt,

            consentDocumentPath: consentDocument?.path,
            consentDocumentOriginalName:
                consentDocument?.originalname,
            consentDocumentMimeType:
                consentDocument?.mimetype,
        });

        return this.statementRequestRepo.save(request);
    }

    async findAllByOrganization(userId: number) {
        const user = await this.userRepo.findOne({
            where: {
                id: userId,
            },
        });

        if (!user?.organizationId) {
            throw new BadRequestException(
                "Organization access is required.",
            );
        }

        return this.statementRequestRepo.find({
            where: {
                requestingOrganizationId: user.organizationId,
            },
            relations: [
                "requestingOrganization",
                "requestedByUser",
            ],
            order: {
                createdAt: "DESC",
            },
        });
    }
}