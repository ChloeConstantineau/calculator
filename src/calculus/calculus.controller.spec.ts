import { Test, TestingModule } from '@nestjs/testing';
import { CalculusController } from './calculus.controller';
import {
  InvalidCharacterError,
  InvalidOperationError,
  UnbalancedParenthesesError,
} from './calculus.error';
import { CalculusService } from './calculus.service';

describe('CalculusController', () => {
  let calculusController: CalculusController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalculusController],
      providers: [CalculusService],
    }).compile();

    calculusController = app.get<CalculusController>(CalculusController);
  });

  describe('Valid calculus operations', () => {
    test.each`
      stringQuery                  | expected
      ${'1+1'}                     | ${1 + 1}
      ${'2-1'}                     | ${2 - 1}
      ${'2*1'}                     | ${2 * 1}
      ${'4/2'}                     | ${4 / 2}
      ${'(2+2)-1'}                 | ${2 + 2 - 1}
      ${'1+(2+2)'}                 | ${1 + (2 + 2)}
      ${'982+(23/(3*3))-23*(2*3)'} | ${982 + 23 / (3 * 3) - 23 * (2 * 3)}
    `(
      'should handle operators in $stringQuery',
      ({ stringQuery, expected }) => {
        const result = {
          error: false,
          result: expected,
        };
        expect(calculusController.getCalculus({ query: stringQuery })).toEqual(
          result,
        );
      },
    );
  });

  describe('Invalid calculus operation', () => {
    const error = InvalidOperationError;
    test.each([
      ['+1'],
      ['-1'],
      ['-1(2-1)'],
      ['1+(2-1)/'],
      ['(1+(2-1)/)'],
      ['1+(2-1)(/)'],
    ])(
      `should throw an error of type ${error.toString()} for query %s`,
      (stringQuery) => {
        expect(() =>
          calculusController.getCalculus({ query: stringQuery }),
        ).toThrow(error);
      },
    );
  });

  describe('Invalid characters in calculus operation', () => {
    const error = InvalidCharacterError;
    test.each([['10%5'], ['2^10'], ['abc'], , ['1+9-2+e']])(
      `should throw an error of type ${error.toString()} for query %s`,
      (stringQuery) => {
        expect(() =>
          calculusController.getCalculus({ query: stringQuery }),
        ).toThrow(error);
      },
    );
  });

  describe('Invalid parentheses in calculus operation', () => {
    const error = UnbalancedParenthesesError;
    test.each([['())'], [')()'], ['((((())))))'], ['((((())))']])(
      `should throw an error of type ${error.toString()} for query %s`,
      (stringQuery) => {
        expect(() =>
          calculusController.getCalculus({ query: stringQuery }),
        ).toThrow(error);
      },
    );
  });
});
