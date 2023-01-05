import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Calculus')
    .setDescription('The calculus API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Graceful termination hooks
  app.enableShutdownHooks();

  const port = parseInt(process.env.PORT, 10) || 3000;
  const timeout = parseInt(process.env.TIMEOUT, 10) || 5000;

  const server = await app.listen(port);
  server.setTimeout(timeout);
}
bootstrap();
