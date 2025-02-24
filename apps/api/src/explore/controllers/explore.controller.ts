import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExploreService } from '../services/explore.service';
import { GetExploreResponse } from '../responses/get-explore.response';
import { Roles } from '@/auth/roles.decorator';
import { Role } from '@repo/core';

@Controller('explore')
@ApiTags('Explore')
export class ExploreController {
  constructor(private exploreService: ExploreService) {}

  @Get()
  @Roles([Role.User])
  async getExplore(): Promise<GetExploreResponse> {
    return await this.exploreService.getExplore();
  }
} 