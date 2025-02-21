import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/modules/core.module';
import { ExploreModule } from './explore/explore.module';
import { ListsModule } from './lists/lists.module';
import { SessionsModule } from './sessions/sessions.module';
import { UserModule } from './user/user.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    AuthModule,
    ExploreModule,
    ListsModule,
    SessionsModule,
    UserModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
