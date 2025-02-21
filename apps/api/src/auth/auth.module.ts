import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Jwt } from './services/jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Jwt],
  exports: [Jwt],
})
export class AuthModule {}
