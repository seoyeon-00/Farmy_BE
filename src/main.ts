import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const port = process.env.SERVER_PORT || 8000;
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT');
  const config = new DocumentBuilder()
    .setTitle('Swagger-tutorial')
    .setDescription('user API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.enableCors(); // cors 활성화

  // 메서드 호출 전 validation 자동 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (configService.get('NODE_ENV') === 'development') {
    Logger.log(`Application running on port ${port}, http://localhost:${port}`);
  }

  await app.listen(port);
}
bootstrap();
