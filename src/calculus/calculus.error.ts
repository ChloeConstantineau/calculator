import { BadRequestException } from '@nestjs/common/exceptions';

const CALCULUS_ERRORS: { [key: string]: string } = {
  INVALID_CHARACTERS_ERROR:
    'Invalid Operators found; Valid operators are [0-9], *, /, +, -, (, )',
  PARENTHESES_UNBALANCED:
    'Unbalanced Parentheses; Input contains invalid parentheses patterns.',
  INVALID_OPERATION:
    'Invalid Operation; Operators such as +, -, * or / should be preceded and followed by a number or a parentheses group.',
};

class CalculusError extends BadRequestException {
  constructor(errorMessage: string) {
    super('Bad Request', {
      cause: new Error(),
      description: errorMessage,
    });
  }
}

export class InvalidCharacterError extends CalculusError {
  constructor() {
    super(CALCULUS_ERRORS['INVALID_CHARACTERS_ERROR']);
  }
}
export class UnbalancedParenthesesError extends CalculusError {
  constructor() {
    super(CALCULUS_ERRORS['PARENTHESES_UNBALANCED']);
  }
}
export class InvalidOperationError extends CalculusError {
  constructor() {
    super(CALCULUS_ERRORS['INVALID_OPERATION']);
  }
}
