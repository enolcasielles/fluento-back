import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from './core/interceptors/exception.interceptor';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/modules/core.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
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
