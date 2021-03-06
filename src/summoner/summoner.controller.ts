import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { Summoner } from './summoner.schema';
import { SummonerDto, SummonerParams } from './summoner.dto';
import { SummonerV4DTO } from 'twisted/dist/models-dto';
import { RiotClientService } from '../riot-client/riot-client.service';
import { TestCronService } from '../test-cron/test-cron.service';


@UsePipes(new ValidationPipe())
@Controller('summoner')
export class SummonerController {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly riotClientService: RiotClientService,
    private readonly cronService: TestCronService
  ) {
  }

  @Post('add')
  add(@Body() summonerDto: SummonerDto): Promise<Summoner> {
    return this.summonerService.create(summonerDto);
  }

  @Get('all')
  findAll(): Promise<Summoner[]> {
    return this.summonerService.getAll();
  }

  @Get('/riot/:name')
  getSummoner(
    @Param() params: SummonerParams
  ): Promise<SummonerV4DTO> {
    return this.riotClientService.summonerByName(params.name);
  }

  @Get('update-all')
  updateAll(): Promise<Summoner[]> {
    return this.cronService.updateSummoners();
  }

  // @Get('create-rank-snapshow')
  // updateRanking(): Promise<Summoner[]> {
  //   return this.cronService.updateSummonersRanking();
  // }
}
