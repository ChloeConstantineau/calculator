import { Test, TestingModule } from '@nestjs/testing';
import { CalculusController } from './calculus.controller';
import { CalculusService } from './calculus.service';

describe('AppController', () => {
  let calculusController: CalculusController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalculusController],
      providers: [CalculusService],
    }).compile();

    calculusController = app.get<CalculusController>(CalculusController);
  });

  describe('root', () => {
    it('should return "Query is: ..."', () => {
      expect(
        calculusController.getCalculus({ query: '982+(23/(3*3))-23*(2*3)' }),
      ).toBe('Query is: 982+(23/(3*3))-23*(2*3)');
    });
  });
});
