import { Controller, Get } from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { Summoner } from '../schemas/summoner.schema';

@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService){}

  @Get('all')
  findAll(): Promise<Summoner[]> {
    return this.summonerService.getAll();
  }
}
