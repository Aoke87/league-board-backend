import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Summoner, SummonerDocument } from './summoner.schema';
import { SummonerDto } from './summoner.dto';

@Injectable()
export class SummonerService {
  constructor(
    @InjectModel(Summoner.name) private summonerModel: Model<SummonerDocument>
  ) {
  }

  async create(summonerDto: SummonerDto): Promise<Summoner> {
    try {
      return new this.summonerModel(summonerDto).save();
    } catch (e) {

    }
  }

  async getAll(): Promise<SummonerDocument[]> {
    return this.summonerModel.find().exec();
  }
}
