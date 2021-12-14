import { IsString, IsNumber } from 'class-validator';

export class SummonerDto {
  @IsString()
  id: string;

  @IsString()
  accountId: string;

  @IsString()
  puuid: string;

  @IsString()
  name: string;

  @IsNumber()
  profileIconId: number;

  @IsNumber()
  revisionDate: number;

  @IsNumber()
  summonerLevel: number;
}

export class SummonerParams {
  @IsString()
  name: string;
}
