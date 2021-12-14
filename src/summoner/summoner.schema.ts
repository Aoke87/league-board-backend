import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const SummonerSchema = SchemaFactory.createForClass(Summoner);
