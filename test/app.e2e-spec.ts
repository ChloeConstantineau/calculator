import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { APP_PIPE } from '@nestjs/core';
import { CalculusResponse } from './../src/calculus/calculus.dto';
import { CalculusService } from './../src/calculus/calculus.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleBuilder: TestingModuleBuilder;

  const stringQuery = '982 + 23 / (3 * 3) - 23 * (2 * 3)';
  const stringQueryEncoded = Buffer.from(stringQuery).toString('base64');
  const result: CalculusResponse = {
    error: false,
    result: 982 + 23 / (3 * 3) - 23 * (2 * 3),
  };

  beforeAll(() => {
    moduleBuilder = Test.createTestingModule({
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
    });
  });

  describe('/calculus?query=... (GET)', () => {
    beforeAll(async () => {
      const moduleFixture = await moduleBuilder.compile();
      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('should be valid base64 encoded request', () => {
      return request(app.getHttpServer())
        .get(`/calculus?query=${stringQueryEncoded}`)
        .expect(200)
        .expect(result);
    });
  });
});
