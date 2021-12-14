import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { SummonerService } from './summoner.service';
import { Summoner } from './summoner.schema';
import { SummonerDto, SummonerParams } from './summoner.dto';
import { SummonerV4DTO } from 'twisted/dist/models-dto';
import { RiotClientService } from '../riot-client/riot-client.service';


@UsePipes(new ValidationPipe())
@Controller('summoner')
export class SummonerController {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly riotClientService: RiotClientService
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
}
