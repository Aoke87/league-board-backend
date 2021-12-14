import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchV5, MatchV5Document } from './match-v5.schema';
import { MatchV5DTOs } from 'twisted/dist/models-dto';


@Injectable()
export class MatchV5Service {
  constructor(
    @InjectModel(MatchV5.name) private matchV5Model: Model<MatchV5Document>
  ) {
  }

  async create(matchV5Dto: MatchV5DTOs.MatchDto): Promise<MatchV5 | null> {
    try {
      const matchV5 = new this.matchV5Model(matchV5Dto);
      matchV5.save(function(err) {
        if (err && (err as any).code !== 11000) {
          console.log(err);
          return;
        }
        if (err && (err as any).code === 11000) {
          console.log('dublicate found');
          return;
        }
      });
    } catch (e) {
      return null;
    }
  }

  async getAll(): Promise<MatchV5Document[]> {
    return this.matchV5Model.find().exec();
  }

  async getAllIdsQuery(): Promise<string[]> {
    const matches = await this.matchV5Model.aggregate([
      { $match: {} },
      { $sort: { 'metadata.matchId': -1 } },
      {
        $project: {
          'matchId': '$metadata.matchId',
          '_id': 0
        }
      }
    ]);
    return matches.map(m => m.matchId);
  }
}
