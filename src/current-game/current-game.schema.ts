import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Summoner } from 'src/summoner/summoner.schema';
import { CurrentGameInfoDTO } from 'twisted/dist/models-dto';


export type CurrentGameDocument = CurrentGame & Document;

@Schema()
export class CurrentGame {
  @Prop({ required: true })
  currentGameId: number;

  @Prop({type : [{ type: MongooseSchema.Types.ObjectId, ref: 'Summoner' }]})
  summoners: string[];

  @Prop({ required: true })
  currentGameInfoDTO: CurrentGameInfoDTO;

  @Prop({ required: true })
  timestamp: number;
}

export const CurrentGameSchema = SchemaFactory.createForClass(CurrentGame);
