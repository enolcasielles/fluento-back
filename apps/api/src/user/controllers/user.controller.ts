import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { Roles } from '@/auth/roles.decorator';
import { Role } from '@repo/core';
import { UserId } from '@/core/decorators/user-id.decorator';
import { GetUserResponse } from '../responses/get-user.response';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles([Role.User])
  async getUser(@UserId() userId: string): Promise<GetUserResponse> {
    return await this.userService.getUser(userId);
  }
} 