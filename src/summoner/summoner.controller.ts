import { Controller, Get, Post, Body } from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { Summoner } from './summoner.schema';
import { SummonerDto } from './summoner.dto';

@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService){}

  @Post('add')
  add(@Body() summonerDto: SummonerDto): Promise<Summoner> {
    return this.summonerService.create(summonerDto);
  }

  @Get('all')
  findAll(): Promise<Summoner[]> {
    return this.summonerService.getAll();
  }
}
