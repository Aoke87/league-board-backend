import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RiotClientService } from './riot-client/riot-client.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly riotClientService: RiotClientService
  ) {
  }

  @Get()
  async getHello(): Promise<string> {
    return 'Hello World';
  }
}
