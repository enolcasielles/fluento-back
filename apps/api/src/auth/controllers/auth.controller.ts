import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest } from '../requests/login.request';
import { BasicResponse, successResponse } from '@/core/responses/basic.response';
import { RegisterRequest } from '../requests/register.request';
import { LoginResponse } from '../responses/login.response';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const { access_token, refresh_token } = await this.authService.login(body.email, body.password);
    return {
      access_token,
      refresh_token,
    };
  }

  @Post('register')
  async register(@Body() body: RegisterRequest): Promise<BasicResponse> {
    await this.authService.register(body.email, body.name, body.password);
    return successResponse();
  }
}
