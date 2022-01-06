import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SummonerLeagueDto } from 'twisted/dist/models-dto';

export type SummonerDocument = Summoner & Document;

@Schema()
class RankDto {
  @Prop({ required: true, type: Number }) timestamp: number;
  @Prop({ required: true }) tier: string;
  @Prop({ required: true }) rank: string;
  @Prop({ required: true }) points: number;
  @Prop({ required: true }) rating: number;
}
const RankDtoSchema = SchemaFactory.createForClass(RankDto);

@Schema()
class RankContainerDto {
  @Prop({ required: true, type: [RankDtoSchema] }) soloQueueRanks: RankDto[];
  @Prop({ required: true, type: [RankDtoSchema] }) flexQueueRanks: RankDto[];
  @Prop({ required: true }) currentSoloQueueRating: number;
  @Prop({ required: true }) currentFlexQueueRating: number;
}
const RankContainerDtoSchema = SchemaFactory.createForClass(RankContainerDto);

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

  @Prop({ required: false })
  leagues2021: SummonerLeagueDto[];

  @Prop({ required: false, type: RankContainerDtoSchema })
  ranking: RankContainerDto;
}

export const SummonerSchema = SchemaFactory.createForClass(Summoner);
