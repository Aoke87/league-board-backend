import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Summoner, SummonerSchema } from './summoner/summoner.schema';
import { SummonerController } from './summoner/summoner.controller';
import { SummonerService } from './summoner/summoner.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    MongooseModule.forFeature([
      { name: Summoner.name, schema: SummonerSchema },
    ]),
  ],
  controllers: [AppController, SummonerController],
  providers: [AppService, SummonerService],
})
export class AppModule {}
