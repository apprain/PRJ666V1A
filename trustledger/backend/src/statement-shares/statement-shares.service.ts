import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";

import { User } from "../users/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateStatementShareDto } from './dto/create-statement-share.dto';
import { StatementShare } from './statement-share.entity';
import { Response } from 'express';
import PDFDocument from "pdfkit";


@Injectable()
export class StatementSharesService {
    constructor(
        @InjectRepository(StatementShare)
        private readonly statementShareRepo: Repository<StatementShare>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(dto: CreateStatementShareDto, userId: number) {
        const token = randomUUID();

        const share = this.statementShareRepo.create({
            bankName: dto.bankName,
            accountNumber: dto.accountNumber,
            startDate: dto.startDate,
            endDate: dto.endDate,
            token,
            status: "active",
            expiresAt: new Date(dto.expireDate),
            organizationId: dto.organizationId,
            userId,
            attemptsRemain: dto.attemptsRemain,
        });

        const saved = await this.statementShareRepo.save(share);
        //statement-shares/verify/
        //http://localhost:3000/statement-shares/verify/44594d6e-7078-4408-a3ca-274dea25fe86
        //http://localhost:3001/share/verify/3baa3987-1b9a-4e6b-b2f7-ec6835911858
        //http://20.151.59.28:3001/
        return {
            id: saved.id,
            token: saved.token,
            shareLink: `share/verify/${saved.token}`,
        };
    }

    async findOrganizationInbox(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        if (!user.organizationId) {
            throw new UnauthorizedException(
                "This account is not connected to an organization",
            );
        }

        return this.statementShareRepo.find({
            where: {
                organizationId: user.organizationId,
            },
            relations: ["organization"],
            order: {
                createdAt: "DESC",
            },
        });
    }

    async verifyToken(token: string) {
        const share = await this.statementShareRepo.findOne({
            where: { token },
        });

        if (!share) {
            return { valid: false, message: 'Invalid share link' };
        }

        if (share.status !== 'active') {
            return { valid: false, message: 'This share link is no longer active' };
        }

        if (new Date() > share.expiresAt) {
            return { valid: false, message: 'This share link has expired' };
        }

        return {
            valid: true,
            message: 'Share link is valid',
            data: share,
        };
    }

    async findAllByUser(userId: number) {

        return this.statementShareRepo.find({
            where: {
                userId,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findAll() {
        return this.statementShareRepo.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async downloadStatement(token: string, res: Response) {
        const verify = await this.verifyToken(token);

        if (!verify.valid) {
            return res.status(400).json({
                message: verify.message,
            });
        }

        // Temporary PDF content for testing
        const pdfContent = `
        Bank Statement



        This is a temporary generated statement.
        Later this will come directly from bank API.
        `;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="statement-${token}.pdf"`,
        );

        return res.send(Buffer.from(pdfContent));
    }

    async findAllByOrganization(organizationId: string) {
        return this.statementShareRepo.find({
            where: {
                organizationId,
                status: "active",
            },
            relations: {
                organization: true,
            },
            order: {
                createdAt: "DESC",
            },
        });
    }
    private generateStatementPdf(
        share: StatementShare,
    ): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50,
            });

            const chunks: Buffer[] = [];

            doc.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
            });

            doc.on("end", () => {
                resolve(Buffer.concat(chunks));
            });

            doc.on("error", reject);

            doc
                .fontSize(22)
                .text("Bank Statement", {
                    align: "center",
                });

            doc.moveDown();

            doc
                .fontSize(12)
                .text(`Financial Institution: ${share.bankName}`);

            doc.text(
                `Account Number: ****${share.accountNumber.slice(-4)}`,
            );

            doc.text(
                `Statement Period: ${share.startDate} to ${share.endDate}`,
            );

            doc.moveDown(2);

            doc
                .fontSize(14)
                .text("Account Summary", {
                    underline: true,
                });

            doc.moveDown();

            doc.fontSize(11);
            doc.text("Opening Balance: $5,000.00");
            doc.text("Total Credits: $8,500.00");
            doc.text("Total Debits: $6,200.00");
            doc.text("Closing Balance: $7,300.00");

            doc.moveDown(2);

            doc
                .fontSize(9)
                .fillColor("#666666")
                .text(
                    "Generated securely through TrustLedger.",
                    {
                        align: "center",
                    },
                );

            doc.end();
        });
    }

    async previewStatement(
        token: string,
        userId: number,
        res: Response,
    ) {
        const share = await this.statementShareRepo.findOne({
            where: { token },
        });

        if (!share) {
            return res.status(404).json({
                message: "Statement share was not found.",
            });
        }

        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found.",
            });
        }

        const isOwner = share.userId === user.id;

        const isAuthorizedOrganization =
            Boolean(user.organizationId) &&
            share.organizationId === user.organizationId;

        if (!isOwner && !isAuthorizedOrganization) {
            return res.status(403).json({
                message:
                    "You are not authorized to preview this statement.",
            });
        }

        if (share.status !== "active") {
            return res.status(400).json({
                message: "This share link is no longer active.",
            });
        }

        if (new Date() > new Date(share.expiresAt)) {
            return res.status(400).json({
                message: "This share link has expired.",
            });
        }

        const pdfBuffer = await this.generateStatementPdf(share);

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `inline; filename="statement-preview-${share.id}.pdf"`,
        );

        res.setHeader("Content-Length", pdfBuffer.length);

        return res.end(pdfBuffer);
    }

    async findSentByOrganization(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user?.organizationId) {
            throw new BadRequestException(
                "Organization access is required.",
            );
        }

        console.log(user.organizationId);

        return this.statementShareRepo.find({
            where: {
                sharedByOrganizationId: user.organizationId,
            },
            relations: {
                organization: true,
                sharedByOrganization: true,
            },
            order: {
                createdAt: "DESC",
            },
        });
    }

}