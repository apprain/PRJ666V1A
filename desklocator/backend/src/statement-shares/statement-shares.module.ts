import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StatementShare } from "./statement-share.entity";
import { StatementSharesController } from "./statement-shares.controller";
import { StatementSharesService } from "./statement-shares.service";
import { User } from "../users/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatementShare,
      User,
    ]),
  ],
  controllers: [StatementSharesController],
  providers: [StatementSharesService],
  exports: [StatementSharesService],
})
export class StatementSharesModule { }