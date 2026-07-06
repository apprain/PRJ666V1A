import { Module } from '@nestjs/common';
import { BrokerageController } from './brokerage.controller';
import { BrokerageService } from './brokerage.service';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [LeadsModule],
  controllers: [BrokerageController],
  providers: [BrokerageService],
})
export class BrokerageModule {}