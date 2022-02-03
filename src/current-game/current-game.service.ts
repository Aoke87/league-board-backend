import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SummonerDocument } from 'src/summoner/summoner.schema';
import { CurrentGameInfoDTO } from 'twisted/dist/models-dto';
import { CurrentGame, CurrentGameDocument } from './current-game.schema';

@Injectable()
export class CurrentGameService {
    private logger = new Logger(CurrentGameService.name);
    constructor(
        @InjectModel(CurrentGame.name) private currentGameModel: Model<CurrentGameDocument>
    ) {

    }

    async create(currentGameInfoDto: CurrentGameInfoDTO, summonerDocument: SummonerDocument) {
        const epochTimestamp = Math.floor(new Date().getTime() / 1000);
        const currentGame = {
            currentGameId: currentGameInfoDto.gameId,
            timestamp: epochTimestamp,
            summoners: [],
            currentGameInfoDTO: currentGameInfoDto,
        }
        currentGame.summoners.push(summonerDocument._id);
        const existingCurrentGame = await this.get(currentGameInfoDto.gameId);
        console.log(existingCurrentGame);
        if (existingCurrentGame) {
            return null;
        }
        return new this.currentGameModel(currentGame).save();

    }

    async get(currentGameId: number): Promise<CurrentGameDocument> {
        const currentGame = await this.currentGameModel.findOne({ 'currentGameInfoDTO.gameId' : currentGameId }).populate('summoners').exec();
        if (currentGame) { return currentGame ;}
        return null;
    }

    async getAll(): Promise<{ _id: string, summoners: string[], id: number}[]> {
        return await this.currentGameModel.aggregate([
            { $match: {} },
            { $project: { 'id': '$currentGameInfoDTO.gameId', 'summoners': 1  }},
        ])
    }

    async delete(currentGameId: number) {
        try {
            await this.currentGameModel.deleteOne({ 'currentGameInfoDTO.gameId' : currentGameId }).exec()
            this.logger.log(`Game ${currentGameId} was deleted from current games database`);
            return;
        } catch (e) {
            console.log(e);
        }
    }
}


