import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsString } from 'class-validator';
import { CurrentGameService } from './current-game.service';

export class CurrentGameParams {
    @IsString()
    id: string;
}
  
@Controller('current-game')
export class CurrentGameController {
    constructor(
        private readonly currentGameService: CurrentGameService,
      ) {
      }

      @Get('by-id/:id')
      getCurrentMatch(@Param() params: CurrentGameParams): Promise<any> {
        return this.currentGameService.get(parseInt(params.id, 10))

      }

      @Get('all')
      getAll(): Promise<any> {
        return this.currentGameService.getAll()

      }

}
