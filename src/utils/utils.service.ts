import { Injectable } from '@nestjs/common';

export enum UTILS {
  RATE_LIMIT = 850,
}

@Injectable()
export class UtilsService {
  public timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
