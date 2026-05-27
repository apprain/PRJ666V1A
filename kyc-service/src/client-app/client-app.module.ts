import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientApp } from './client-app.entity';
import { ClientAppService } from './client-app.service';
import { ClientAppController } from './client-app.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientApp])],
  controllers: [ClientAppController],
  providers: [ClientAppService],
  exports: [ClientAppService],
})
export class ClientAppModule { }