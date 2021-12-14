import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SummonerService } from '../summoner/summoner.service';
import { RiotClientService } from '../riot-client/riot-client.service';
import { SummonerDocument } from '../summoner/summoner.schema';
import { ApiResponseDTO, CurrentGameInfoDTO, SpectatorNotAvailableDTO, SummonerV4DTO } from 'twisted/dist/models-dto';
import { MatchV5Service } from '../match-v5/match-v5.service';

@Injectable()
export class TestCronService {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly riotClientService: RiotClientService,
    private readonly matchService: MatchV5Service
  ) {
  }


  /**
   * Updates all Summoners in the Database (profilePic, level, accountId, name...).
   */
  @Cron(CronExpression.EVERY_2_HOURS)
  async updateSummoners() {
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    for (const summonerModel of allSummoners) {
      const summonerApi = await this.riotClientService.summonerByName(summonerModel.name);
      summonerModel.name = summonerApi.name;
      summonerModel.summonerLevel = summonerApi.summonerLevel;
      summonerModel.id = summonerApi.id;
      summonerModel.accountId = summonerApi.accountId;
      summonerModel.profileIconId = summonerApi.profileIconId;
      summonerModel.revisionDate = summonerApi.revisionDate;
      const result = await summonerModel.save();
      console.log(result);
    }
  }

  @Cron('0 */2 * * * *')
  async reportSummonerIngame(): Promise<void> {
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    for (const summonerModel of allSummoners) {
      const response: SpectatorNotAvailableDTO | ApiResponseDTO<CurrentGameInfoDTO> = await this.riotClientService.getSummonerIngame(summonerModel.id);
      if (Object.hasOwnProperty.call(response, 'message')) {
        // console.log(`${summonerModel.name} is not in a game`);
        // add to database if not already exist -> string only
        // check all 20 sek if any game is finished from database?
      } else if (Object.hasOwnProperty.call(response, 'response')) {
        console.log(`${summonerModel.name} is currently (${(new Date()).toTimeString()}) in game: ${(response as ApiResponseDTO<CurrentGameInfoDTO>).response.gameId}`);
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getNewMatches(): Promise<string[]> {
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    let result = [];
    for (const summonerModel of allSummoners) {
      const matchIds = await this.riotClientService.getMatchHistory(summonerModel.puuid, 5);
      result = [...result, ...matchIds];
    }
    console.log(result);
    return result;
  }


  async updateSummonersMatch() {
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    for (const summonerModel of allSummoners) {
      const reponse = await this.riotClientService.getFullMatchHistory(summonerModel.puuid);
    }
  }
}