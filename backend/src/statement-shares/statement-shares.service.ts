import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateStatementShareDto } from './dto/create-statement-share.dto';
import { StatementShare } from './statement-share.entity';
import { Response } from 'express';

@Injectable()
export class StatementSharesService {
    constructor(
        @InjectRepository(StatementShare)
        private readonly statementShareRepo: Repository<StatementShare>,
    ) { }

    async create(dto: CreateStatementShareDto, userId: number) {
        const token = randomUUID();

        const share = this.statementShareRepo.create({
            bankName: dto.bankName,
            accountNumber: dto.accountNumber,
            startDate: dto.startDate,
            endDate: dto.endDate,
            token,
            status: 'active',
            expiresAt : dto.expireDate,
            userId,
            attemptsRemain: dto.attemptsRemain
        });

        const saved = await this.statementShareRepo.save(share);
        //statement-shares/verify/
        //http://localhost:3000/statement-shares/verify/44594d6e-7078-4408-a3ca-274dea25fe86
        //http://localhost:3001/share/verify/3baa3987-1b9a-4e6b-b2f7-ec6835911858
        return {
            id: saved.id,
            token: saved.token,
            shareLink: `http://20.151.59.28:3001/share/verify/${saved.token}`,
        };
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
}