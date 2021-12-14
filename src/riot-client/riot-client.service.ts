import { Injectable } from '@nestjs/common';
import { Constants, LolApi } from 'twisted';
import {
  ApiResponseDTO,
  CurrentGameInfoDTO, MatchV5DTOs,
  SpectatorNotAvailableDTO,
  SummonerV4DTO
} from 'twisted/dist/models-dto';
import { RegionGroups } from 'twisted/dist/constants';
import { UTILS, UtilsService } from '../utils/utils.service';

const api = new LolApi();

@Injectable()
export class RiotClientService {
  constructor(
    private utilsService: UtilsService
  ) {
  }

  public async summonerByName(name: string): Promise<SummonerV4DTO> {
    const summoner = await api.Summoner.getByName(name, Constants.Regions.EU_WEST);
    return summoner.response;
  }

  public async getSummonerIngame(summonerId: string): Promise<SpectatorNotAvailableDTO | ApiResponseDTO<CurrentGameInfoDTO>> {
    try {
      const response = await api.Spectator.activeGame(summonerId, Constants.Regions.EU_WEST);
      return response as ApiResponseDTO<CurrentGameInfoDTO>;
    } catch (e) {
      return e.body.status as SpectatorNotAvailableDTO;
    }
  }

  public async getMatchHistory(puuid: string, count): Promise<string[]> {
    return await this.getMatchIds(puuid, 0, count);
  }

  public async getFullMatchHistory(puuid: string): Promise<string[]> {
    const resultMatchIds: string[] = [];
    let start = 0;
    let newMatches: string[] = [];
    let initial = true;
    try {
      while (initial || newMatches.length === 100) {
        initial = false;
        newMatches = await this.getMatchIds(puuid, start);
        start = start + 100;
        for (const matchId of newMatches) {
          resultMatchIds.push(matchId);
        }
      }
    } catch (e) {
      return [];
    }
    return resultMatchIds;
  }

  private async getMatchIds(puuid: string, start: number, count?: number): Promise<string[]> {
    await this.utilsService.timeout(UTILS.RATE_LIMIT);
    const response: ApiResponseDTO<string[]> = await api.MatchV5.list(puuid, RegionGroups.EUROPE, {
      start,
      count: count || 100
    });
    return response.response || [];
  }

  public async getMatch(matchId: string, shouldRateLimit = false): Promise<ApiResponseDTO<MatchV5DTOs.MatchDto> | null> {
    if (shouldRateLimit) {
      await this.utilsService.timeout(UTILS.RATE_LIMIT);
    }
    try {
      const matchResult: ApiResponseDTO<MatchV5DTOs.MatchDto> = await api.MatchV5.get(matchId, RegionGroups.EUROPE);
      return matchResult;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
