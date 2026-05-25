import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { CreateStatementShareDto } from './dto/create-statement-share.dto';
import { StatementSharesService } from './statement-shares.service';
import type { Response } from 'express';


@Controller('statement-shares')
export class StatementSharesController {
    constructor(
        private readonly statementSharesService: StatementSharesService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() dto: CreateStatementShareDto, @Req() req) {
        return this.statementSharesService.create(
            dto,
            req.user.userId
        );
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAllByUser( @Req() req) {
        return this.statementSharesService.findAllByUser(req.user.userId);
    }

    @Get()
    findAll() {
        return this.statementSharesService.findAll();
    }


    @Get('verify/:token')
    verify(@Param('token') token: string) {
        return this.statementSharesService.verifyToken(token);
    }

    @Get('download/:token')
    async download(@Param('token') token: string, @Res() res: Response) {
        return this.statementSharesService.downloadStatement(token, res);
    }
}