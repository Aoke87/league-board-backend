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
  async getHello(): Promise<string[]> {
    const matches = await this.riotClientService.getFullMatchHistory('ChxWxTVlCG7QRDWq7-LHE8Rxe65HRyQVa2J-bBryThiWo2U18MKQh2yxtoEjrnRM1rvFt8lgEAkFRQ');
    return matches;
  }
}
