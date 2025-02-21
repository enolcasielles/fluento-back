import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './core/pipes/validation.pipe';
import { ResponsesInterceptor } from './core/interceptors/responses.interceptor';
import { Jwt } from './auth/services/jwt.service';
import { RolesGuard } from './auth/roles.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_VERSION } from './app.service';
import { ErrorsFilter } from './core/filters/errors.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponsesInterceptor());
  app.useGlobalFilters(new ErrorsFilter());
  app.setGlobalPrefix('api');
  const reflector = app.get(Reflector);
  const jwt = app.get(Jwt);
  app.useGlobalGuards(new RolesGuard(reflector, jwt));
  const config = new DocumentBuilder()
    .setTitle('Fluento API Rest')
    .setVersion(API_VERSION)
    .setDescription(
      `Base URL: ${process.env.API_URL}`,
    )
    .addSecurity('user-role-required', {
      type: 'apiKey',
      description: 'You should provide a token from a normal user',
      name: 'Authorization',
      in: 'Headers',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
