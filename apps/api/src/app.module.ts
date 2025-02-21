import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from './core/interceptors/exception.interceptor';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
  ],
})
export class AppModule {}
