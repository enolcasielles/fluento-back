import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListsService } from '../services/lists.service';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';
import { Role } from '@repo/core';
import { CreateListRequest } from '../requests/create-list.request';
import { GetListDetailResponse } from '../responses/get-list-detail.response';
import { GetListSessionResponse } from '../responses/get-list-session.response';
import { GetMyListsResponse } from '../responses/get-my-lists.response';
import { GetSavedListsResponse } from '../responses/get-saved-lists.response';
import { CreateListResponse } from '../responses/create-list.response';
import { UserId } from '@/core/decorators/user-id.decorator';

@Controller('lists')
@ApiTags('Lists')
export class ListsController {
  constructor(private listsService: ListsService) {}

  @Post()
  @Roles([Role.User])
  async createList(
    @UserId() userId: string,
    @Body() request: CreateListRequest
  ): Promise<CreateListResponse> {
    return await this.listsService.createList(userId, request);
  }

  @Get()
  @Roles([Role.User])
  async getMyLists(@UserId() userId: string): Promise<GetMyListsResponse> {
    return await this.listsService.getMyLists(userId);
  }

  @Get('saved')
  @Roles([Role.User])
  async getSavedLists(@UserId() userId: string): Promise<GetSavedListsResponse> {
    return await this.listsService.getSavedLists(userId);
  }

  @Get(':listId')
  @Roles([Role.User])
  async getListDetail(
    @Param('listId') listId: string,
    @UserId() userId: string
  ): Promise<GetListDetailResponse> {
    return await this.listsService.getListDetail(listId, userId);
  }

  @Get(':listId/session')
  @Roles([Role.User])
  async getListSession(
    @Param('listId') listId: string,
    @UserId() userId: string
  ): Promise<GetListSessionResponse> {
    return await this.listsService.getListSession(listId, userId);
  }

  @Post(':listId/save')
  @Roles([Role.User])
  async saveList(
    @Param('listId') listId: string,
    @UserId() userId: string
  ): Promise<void> {
    await this.listsService.saveList({ listId, userId });
  }

  @Delete(':listId/save')
  @Roles([Role.User])
  async deleteSavedList(
    @Param('listId') listId: string,
    @UserId() userId: string
  ): Promise<void> {
    await this.listsService.deleteSavedList(listId, userId);
  }
} 