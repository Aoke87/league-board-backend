import { Controller, Get, Param } from '@nestjs/common';
import { IsString } from 'class-validator';
import { TestCronService } from 'src/test-cron/test-cron.service';
import { ApiResponseDTO, MatchV5DTOs } from 'twisted/dist/models-dto';
import { RiotClientService } from '../riot-client/riot-client.service';
import { MatchV5Service } from './match-v5.service';

class PageParams {
  @IsString()
  page: string;
}

@Controller('match-v5')
export class MatchV5Controller {
  constructor(
    readonly riotClientService: RiotClientService,
    readonly matchService: MatchV5Service,
    readonly testCronService: TestCronService
  ) {
  }

  @Get('all-ids')
  async getTopTen(): Promise<any[]> {
    return await this.matchService.getAllIdsQuery();
  }

  @Get('latest')
  async getLatest(): Promise<any[]> {
    return await this.matchService.getLatest();
  }

  @Get('page/:page')
  async getCount(
    @Param() params: PageParams
  ): Promise<any[]> {
    return await this.matchService.getPage(params.page);
  }

  @Get('riot/add/all')
  async getMatch(): Promise<void> {
    const matchIdsOfSummoner: string[] = await this.riotClientService.getFullMatchHistory('qCdKtICwMqqttj6Bvu1BTViQKLoW4rZYd6ljUuKIbJEptTC8i7iyPaokQ-_lv8YDX97cmAH2hGsx8Q');
    const existingMatchIds: string[] = await this.matchService.getAllIdsQuery();
    const missingMatchIds = matchIdsOfSummoner.filter(matchIdOfSummoner => !existingMatchIds.includes(matchIdOfSummoner));
    console.log(missingMatchIds[0]);

    for (const matchId of missingMatchIds) {
      const match: ApiResponseDTO<MatchV5DTOs.MatchDto> = await this.riotClientService.getMatch(matchId);
      if (match) {
        await this.matchService.create(match.response);
      }
    }
  }

  @Get('riot/add-new')
  async getAllMissingMatches() {
    return await this.testCronService.getNewMatches();
  }

}
