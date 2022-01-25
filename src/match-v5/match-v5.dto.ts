import { IsString } from 'class-validator';


export class MatchV5Params {
  @IsString()
  matchId: string;
}