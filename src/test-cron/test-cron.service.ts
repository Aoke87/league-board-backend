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
import { CurrentGameService } from 'src/current-game/current-game.service';
import { CurrentGameDocument } from 'src/current-game/current-game.schema';

@Injectable()
export class TestCronService {
  private readonly logger = new Logger(TestCronService.name);

  constructor(
    private readonly summonerService: SummonerService,
    private readonly riotClientService: RiotClientService,
    private readonly matchService: MatchV5Service,
    private readonly utilsService: UtilsService,
    private readonly currentGameService: CurrentGameService
  ) { }

  /**
   * Updates all Summoners in the Database (profilePic, level, accountId, name...).
   */
  @Cron(CronExpression.EVERY_2_HOURS)
  async updateSummoners() {
    this.logger.verbose('⬆️  Updating summoners..');
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();
    for (const summonerModel of allSummoners) {
      const summonerApi = await this.riotClientService.summonerByPuuid(summonerModel.puuid);
      const leagues: SummonerLeagueDto[] = await this.riotClientService.leagueBySummonerName(summonerApi.id);
      summonerModel.name = summonerApi.name;
      summonerModel.summonerLevel = summonerApi.summonerLevel;
      summonerModel.id = summonerApi.id;
      summonerModel.accountId = summonerApi.accountId;
      summonerModel.puuid = summonerApi.puuid;
      summonerModel.profileIconId = summonerApi.profileIconId;
      summonerModel.revisionDate = summonerApi.revisionDate;
      summonerModel.leagues = leagues;
      this.updateSummonersRanking(summonerModel, leagues);
      await summonerModel.save();
    }
    return allSummoners;
  }

  /**
   * Cron Job to check if a summoner is in a game. Currently only logging
   */
  @Cron('30 */1 * * * *')
  async reportSummonerIngame(): Promise<void> {
    this.logger.verbose('Reporting summoners ingame...');
    const allSummoners: SummonerDocument[] = await this.summonerService.getAll();


    for (const summonerModel of allSummoners) {
      const response: SpectatorNotAvailableDTO | ApiResponseDTO<CurrentGameInfoDTO> = await this.riotClientService.getSummonerIngame(summonerModel.id);
      const currentGame: CurrentGameInfoDTO = (response as ApiResponseDTO<CurrentGameInfoDTO>).response ;
      if (Object.hasOwnProperty.call(response, 'response')) {
        this.addCurrentGame(currentGame, summonerModel);
        this.logger.log(`${summonerModel.name} is currently (${(new Date()).toTimeString()}) in game: ${currentGame.gameId}`);
      }
      
      if (Object.hasOwnProperty.call(response, 'message')) {
        // console.log(`${summonerModel.name} is not in a game`);
      }
    }
  }

  private async addCurrentGame(currentGame: CurrentGameInfoDTO, summonerDoc: SummonerDocument) {
    let existingCurrentGame: CurrentGameDocument = await this.currentGameService.get(currentGame.gameId);
    // create current game if it does not already exist
    if (!existingCurrentGame) {
      existingCurrentGame = await this.currentGameService.create(currentGame, summonerDoc);
      return existingCurrentGame;
    }

    // push summoner to current game if summoner not already exists
    if (existingCurrentGame && !this.doesSumExistOnCurrentGame(existingCurrentGame, summonerDoc)) {
      existingCurrentGame.summoners = existingCurrentGame.summoners.map((sumDoc: SummonerDocument) => sumDoc._id);
      existingCurrentGame.summoners.push(summonerDoc._id)
      existingCurrentGame.save();
      return existingCurrentGame;
    }
  }

  private doesSumExistOnCurrentGame(currentGame: CurrentGameDocument, summonerDoc: SummonerDocument) {
    return !!currentGame.summoners.find(sumInCurrentGameId => sumInCurrentGameId.puuid === summonerDoc.puuid);
  }

  /**
   * This cron checks if currentGames are present and makes a call get the full match info.
   * If the matchInfo is returned, the current game is over and will be deleted from the database. 
   * If nothing is returned the Cron will check again 1 minute later.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async getNewMatchesByCurrentGames() {
    this.logger.verbose('Checking for new matches inside current-matches collection...');
    const existingCurrentGames = await this.currentGameService.getAll();
    if (!existingCurrentGames || existingCurrentGames.length === 0) {
      this.logger.verbose('No current matches!');
      return;
    }

    for (const existingCurrentGame of existingCurrentGames) {
      this.logger.verbose('Ongoing match was found trying to load it..');
        const matchId = "EUW1_" + existingCurrentGame.id;
        try {
          const matchV5: ApiResponseDTO<MatchV5DTOs.MatchDto> = await this.riotClientService.getMatch(matchId);
          if (matchV5) {
            this.logger.verbose(matchV5.response.info.gameId, 'found');
            await this.matchService.create(matchV5.response);
            await this.currentGameService.delete(matchV5.response.info.gameId);
            return;
          }
          this.logger.verbose('Match data not yet found...');
        } catch (e) {
          this.logger.verbose('[Error] Match data not yet found...');
        }
    }
    return existingCurrentGames;
  }

  /**
   * Cron Job that check every summoners match history every 5 minutes to see if any new 
   * games have been played. If any new matches exist, add them to the matches collection.
   */
  @Cron('30 0 * * *')
  async getNewMatches(): Promise<string[]> {
    this.logger.verbose('EveryMidnight only: Checking for new matches...');
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
      const match: ApiResponseDTO<MatchV5DTOs.MatchDto> = await this.riotClientService.getMatch(matchId);
      if (match) {
        await this.matchService.create(match.response);
      }
    }
    return missingMatchIds;
  }

  private updateSummonersRanking(summonerModel: SummonerDocument, leagues: SummonerLeagueDto[]): void {
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
}
