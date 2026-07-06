import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatementSharesController } from './statement-shares.controller';
import { StatementSharesService } from './statement-shares.service';
import { StatementShare } from './statement-share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatementShare])],
  controllers: [StatementSharesController],
  providers: [StatementSharesService],
})
export class StatementSharesModule {}