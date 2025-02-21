import { Module } from '@nestjs/common';
import { ListsController } from './controllers/lists.controller';
import { ListsService } from './services/lists.service';
import { ProcessListService } from './services/process-list.service';

@Module({
  controllers: [ListsController],
  providers: [ListsService, ProcessListService],
})
export class ListsModule {} 