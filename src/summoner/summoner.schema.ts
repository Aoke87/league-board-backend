import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SummonerLeagueDto } from 'twisted/dist/models-dto';

export type SummonerDocument = Summoner & Document;

@Schema()
export class Summoner {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  accountId: string;

  @Prop({ required: true, unique: true, dropDups: true })
  puuid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  profileIconId: number;

  @Prop({ required: true })
  revisionDate: number;

  @Prop({ required: true })
  summonerLevel: number;

  @Prop({ required: false })
  leagues: SummonerLeagueDto[];
}

export const SummonerSchema = SchemaFactory.createForClass(Summoner);
