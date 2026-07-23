import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { Organization } from "./organization.entity";

@Controller("organizations")
export class OrganizationsController {
    constructor(
        private readonly organizationsService: OrganizationsService,
    ) { }

    @Post()
    create(@Body() body: Partial<Organization>) {
        return this.organizationsService.create(body);
    }

    @Get()
    findAll() {
        return this.organizationsService.findAll();
    }
}