import { Injectable } from '@nestjs/common';
import { CalculusResponse } from './calculus.dto';

@Injectable()
export class CalculusService {
  private ERRORS: { [key: string]: string } = {
    INVALID_CHARACTERS_ERROR:
      'Invalid Operators found; Valid operators are [0-9], *, /, +, -, (, )',
    PARENTHESES_UNBALANCED:
      'Unbalanced Parentheses; Input contains invalid parentheses patterns.',
    INVALID_OPERATION:
      'Invalid Operation; Operators such as +, -, * or / should be preceded and followed by a number or a parentheses group.',
  };

  run(input: string): CalculusResponse {
    if (!this.isOnlyValidCharacters(input))
      return { error: true, message: this.ERRORS['INVALID_CHARACTERS_ERROR'] };

    if (!this.isBalancedParentheses(input))
      return { error: true, message: this.ERRORS['PARENTHESES_UNBALANCED'] };

    if (!this.isValidOperators(input))
      return { error: true, message: this.ERRORS['INVALID_OPERATION'] };

    return this.compute(input);
  }

  private isOnlyValidCharacters(input: string): boolean {
    // prettier-ignore
    const regex = new RegExp('^[0-9()*\/+-]*$');
    return regex.test(input);
  }

  private isBalancedParentheses(input: string): boolean {
    let stack = 0;
    let balanced = true;
    const parentheses = [...input].filter((c) => c === '(' || c === ')');

    for (let i = 0; i < parentheses.length; i++) {
      if (parentheses[i] == '(') stack++;
      else if (parentheses[i] == ')' && stack <= 0) {
        balanced = false;
        break;
      } else stack--;
    }

    return balanced && stack == 0;
  }

  private isValidOperators(input: string): boolean {
    const ops = [...input];
    const OPERATORS = ['+', '-', '*', '/'];

    if (OPERATORS.includes(ops[0]) || OPERATORS.includes(ops[ops.length - 1])) {
      return false;
    } else {
      let valid = true;
      for (let i = 1; i < ops.length - 1; i++) {
        if (OPERATORS.includes(ops[i])) {
          let previous = ops[i - 1];
          let next = ops[i + 1];
          if (OPERATORS.includes(previous) || OPERATORS.includes(next)) {
            valid = false;
            break;
          }
        }
      }
      return valid;
    }
  }

  private compute(input: string): CalculusResponse {
    return { error: false, result: 2 };
  }
}
