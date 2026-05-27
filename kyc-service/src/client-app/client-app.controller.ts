import { Body, Controller, Post } from '@nestjs/common';
import { ClientAppService } from './client-app.service';
import { CreateClientAppDto } from './dto/create-client-app.dto';

@Controller('api/v1/client-apps')
export class ClientAppController {
  constructor(private readonly clientAppService: ClientAppService) {}

  @Post()
  create(@Body() dto: CreateClientAppDto) {
    return this.clientAppService.create(dto);
  }
}