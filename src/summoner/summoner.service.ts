import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Summoner, SummonerDocument } from '../schemas/summoner.schema';

@Injectable()
export class SummonerService {
  constructor(
    @InjectModel(Summoner.name) private summonerModel: Model<SummonerDocument>,
  ) {}

  async create(summonerDto): Promise<Summoner> {
    const createdSummoner = new this.summonerModel(summonerDto);
    return createdSummoner.save();
  }

  async getAll(): Promise<Summoner[]> {
    return this.summonerModel.find().exec();
  }
}
