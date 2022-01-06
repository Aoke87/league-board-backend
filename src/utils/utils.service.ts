import { Injectable } from '@nestjs/common';

export enum UTILS {
  RATE_LIMIT = 850,
}


@Injectable()
export class UtilsService {
  public timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  public getRankedProjection(key: string): number {
    const rankProjection: { [key: string]: number } = {
      'I': 3,
      'II': 2,
      'III': 1,
      'IV': 0
    };
    return rankProjection[key];
  }

  public getTierProjection(key: string): number {
    const tierProjection: { [key: string]: number } = {
      'CHALLENGER': 8,
      'GRANDMASTER': 7,
      'MASTER': 6,
      'DIAMOND': 5,
      'PLATINUM': 4,
      'GOLD': 3,
      'SILVER': 2,
      'BRONZE': 1,
      'IRON': 0,
    };
    return tierProjection[key];
  }
}
