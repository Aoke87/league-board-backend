import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Summoner, SummonerSchema } from './summoner/summoner.schema';
import { MatchV5, MatchV5Schema } from './match-v5/match-v5.schema';
import { SummonerController } from './summoner/summoner.controller';
import { SummonerService } from './summoner/summoner.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TestCronService } from './test-cron/test-cron.service';
import { RiotClientService } from './riot-client/riot-client.service';
import { MatchV5Service } from './match-v5/match-v5.service';
import { UtilsService } from './utils/utils.service';
import { MatchV5Controller } from './match-v5/match-v5.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    MongooseModule.forFeature([
      { name: Summoner.name, schema: SummonerSchema },
      { name: MatchV5.name, schema: MatchV5Schema }
    ]),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [AppController, SummonerController, MatchV5Controller],
  providers: [AppService, SummonerService, TestCronService, RiotClientService, MatchV5Service, UtilsService]
})
export class AppModule {
}
