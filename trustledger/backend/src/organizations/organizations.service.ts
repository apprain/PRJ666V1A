import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./organization.entity";

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
    ) { }

    async create(data: Partial<Organization>) {
        const organization = this.organizationRepository.create(data);
        return this.organizationRepository.save(organization);
    }

    async findAll() {
        return this.organizationRepository.find({
            order: {
                name: "ASC",
            },
        });
    }

    async findOne(id: string) {
        return this.organizationRepository.findOne({
            where: { id },
        });
    }
}