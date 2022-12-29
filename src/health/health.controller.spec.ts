import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be healthy', () => {
    const healthy = {
      status: 'ok',
      info: {},
      error: {},
      details: {},
    };
    controller.check().then((res) => expect(res).toStrictEqual(healthy));
  });
});
