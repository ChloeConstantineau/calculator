import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { APP_PIPE } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
          }),
        },
      ],
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/calculus?query=... (GET)', () => {
    return request(app.getHttpServer())
      .get('/calculus?query=OTgyKygyMy8oMyogMykpLTIzKigyKjMgKSA=')
      .expect(200)
      .expect('Query is: 982+(23/(3*3))-23*(2*3)');
  });
});
