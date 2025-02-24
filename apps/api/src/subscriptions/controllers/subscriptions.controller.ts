import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from '../services/subscriptions.service';
import { Roles } from '@/auth/roles.decorator';
import { Role } from '@repo/core';
import { UserId } from '@/core/decorators/user-id.decorator';
import { GetSubscriptionStatusResponse } from '../responses/get-subscription-status.response';
import { BasicResponse } from '@/core/responses/basic.response';

@Controller('subscriptions')
@ApiTags('Subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('status')
  @Roles([Role.User])
  async getStatus(@UserId() userId: string): Promise<GetSubscriptionStatusResponse> {
    return await this.subscriptionsService.getStatus(userId);
  }

  @Post('activate')
  @Roles([Role.User])
  async activate(@UserId() userId: string): Promise<BasicResponse> {
    return await this.subscriptionsService.activate(userId);
  }

  @Post('cancel')
  @Roles([Role.User])
  async cancel(@UserId() userId: string): Promise<BasicResponse> {
    return await this.subscriptionsService.cancel(userId);
  }
} 