import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Summoner, SummonerSchema } from './schemas/summoner.schema';
import { SummonerController } from './summoner/summoner.controller';
import { SummonerService } from './summoner/summoner.service';

console.log('process.env', process.env);
console.log('MONGO_DB_URL', process.env.MONGO_DB_URL);

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
