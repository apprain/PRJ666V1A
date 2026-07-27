import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "../users/user.entity";
import { StatementRequest } from "./statement-request.entity";
import { StatementRequestsController } from "./statement-requests.controller";
import { StatementRequestsService } from "./statement-requests.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatementRequest,
      User,
    ]),
  ],
  controllers: [StatementRequestsController],
  providers: [StatementRequestsService],
  exports: [StatementRequestsService],
})
export class StatementRequestsModule { }