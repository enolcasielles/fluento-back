import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Jwt } from './services/jwt.service';
import { getSupabaseClient } from '@/core/lib/supabase';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Jwt, {
    provide: "SUPABASE_CLIENT",
    useFactory: () => {
      return getSupabaseClient()
    }
  }],
  exports: [Jwt],
})
export class AuthModule {}
