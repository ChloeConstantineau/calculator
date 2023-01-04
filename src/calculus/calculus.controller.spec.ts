import { Test, TestingModule } from '@nestjs/testing';
import { CalculusController } from './calculus.controller';
import { CalculusResponse } from './calculus.dto';
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
    it('should return a valid result with no errors', () => {
      const query = '982+(23/(3*3))-23*(2*3)';
      const result: CalculusResponse = {
        error: false,
        result: 982 + 23 / (3 * 3) - 23 * (2 * 3),
      };
      expect(calculusController.getCalculus({ query: query })).toEqual(result);
    });
  });
});
