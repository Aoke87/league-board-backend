import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SummonerService } from '../summoner/summoner.service';
import { RiotClientService } from '../riot-client/riot-client.service';
import { SummonerDocument } from '../summoner/summoner.schema';
import {
  ApiResponseDTO,
  CurrentGameInfoDTO,
  MatchV5DTOs,
  SpectatorNotAvailableDTO,
  SummonerLeagueDto,
} from 'twisted/dist/models-dto';
import { MatchV5Service } from '../match-v5/match-v5.service';
import { UTILS, UtilsService } from 'src/utils/utils.service';

@Injectable()
export class TestCronService {
  private readonly logger = new Logger(TestCronService.name);

  constructor(
    private readonly summonerService: SummonerService,
    private readonly riotClientService: RiotClientService,
    private readonly matchService: MatchV5Service,
    private readonly utilsService: UtilsService,
  ) { }

  /**
   * Updates all Summoners in the Database (profilePic, level, accountId, name...).
   */
  @Cron(CronExpression.EVERY_2_HOURS)
  async updateSummoners() {
    this.logger.verbose('⬆️  Updating summoners..');
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    for (const summonerModel of allSummoners) {
      const leagues: SummonerLeagueDto[] = await this.riotClientService.leagueBySummonerName(summonerModel.id);
      const summonerApi = await this.riotClientService.summonerByName(summonerModel.name);
      summonerModel.name = summonerApi.name;
      summonerModel.summonerLevel = summonerApi.summonerLevel;
      summonerModel.id = summonerApi.id;
      summonerModel.accountId = summonerApi.accountId;
      summonerModel.puuid = summonerApi.puuid;
      summonerModel.profileIconId = summonerApi.profileIconId;
      summonerModel.revisionDate = summonerApi.revisionDate;
      summonerModel.leagues = leagues;
      summonerModel.leagues2021 = leagues;
      this.updateSummonersRanking(summonerModel, leagues);
      await summonerModel.save();
    }
    return allSummoners;
  }

  // todo: ranking value!! -> 
  updateSummonersRanking(summonerModel: SummonerDocument, leagues: SummonerLeagueDto[]): void {
    if (!summonerModel.ranking) {
      summonerModel.ranking = {
        soloQueueRanks: [],
        flexQueueRanks: [],
        currentFlexQueueRating: 0,
        currentSoloQueueRating: 0
      }
    } 
    const epochTimestamp = Math.floor(new Date().getTime() / 1000);
    leagues.forEach(league => {
      const { tier, rank, queueType, leaguePoints } = league;
      const rating = (this.utilsService.getTierProjection(tier) * 400) + (this.utilsService.getRankedProjection(rank) * 100) + leaguePoints;
      const rankSnapshot = {
        timestamp: epochTimestamp,
        points: leaguePoints,
        tier,
        rank,
        rating,
      }
      if (queueType === 'RANKED_FLEX_SR' && summonerModel.ranking.currentFlexQueueRating !== rating) {
        summonerModel.ranking.currentFlexQueueRating = rating;
        summonerModel.ranking.flexQueueRanks.unshift(rankSnapshot)
      }
      if (queueType === 'RANKED_SOLO_5x5' && summonerModel.ranking.currentSoloQueueRating !== rating) {
        summonerModel.ranking.currentSoloQueueRating = rating;
        summonerModel.ranking.soloQueueRanks.unshift(rankSnapshot);
      }
    })

  }

  /**
   * Cron Job to check if a summoner is in a game. Currently only logging
   */
  @Cron("30 */2 * * * *")
  async reportSummonerIngame(): Promise<void> {
    this.logger.verbose('Reporting summoners ingame...');
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    const currentGames: { summonerName: string, currentGame: CurrentGameInfoDTO }[] = [];

    for (const summonerModel of allSummoners) {
      const response: SpectatorNotAvailableDTO | ApiResponseDTO<CurrentGameInfoDTO> = await this.riotClientService.getSummonerIngame(summonerModel.id);
      if (Object.hasOwnProperty.call(response, 'message')) {
        // console.log(`${summonerModel.name} is not in a game`);
      } else if (Object.hasOwnProperty.call(response, 'response')) {
        currentGames.push({ 
          summonerName: summonerModel.name, 
          currentGame: (response as ApiResponseDTO<CurrentGameInfoDTO>).response 
        })
        this.logger.log(`${summonerModel.name} is currently (${(new Date()).toTimeString()}) in game: ${(response as ApiResponseDTO<CurrentGameInfoDTO>).response.gameId}`);
      }
    }

    if (currentGames.length === 0) {
      this.logger.verbose('Currently no matches being played!');
    }
  }

  /**
   * Cron Job that check every summoners match history every 2 minutes to see if any new 
   * games have been played. If any new matches exist, add them to the matches collection.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async getNewMatches(): Promise<string[]> {
    this.logger.verbose('Checking for new matches...');
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    const existingMatchIds: string[] = await this.matchService.getAllIdsQuery();
    let result = [];
    for (const summonerModel of allSummoners) {
      await this.utilsService.timeout(UTILS.RATE_LIMIT); 
      const matchIds = await this.riotClientService.getMatchHistory(summonerModel.puuid, 10);
      result = [...result, ...matchIds];
    }
    const missingMatchIds = result.filter(matchId => !existingMatchIds.includes(matchId));
    if (missingMatchIds.length === 0) {
      this.logger.verbose('No new matches found!');
    }

    for (const matchId of missingMatchIds) {
      const match: ApiResponseDTO<MatchV5DTOs.MatchDto> = await this.riotClientService.getMatch(matchId, true);
      if (match) {
        await this.matchService.create(match.response);
        this.logger.log(`New match added : ${matchId}`);
      }
    }
    return missingMatchIds;
  }
}
