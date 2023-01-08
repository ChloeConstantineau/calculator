import { Injectable } from '@nestjs/common';
import { CalculusResponse } from './calculus.dto';
import {
  InvalidCharacterError,
  InvalidOperationError,
  UnbalancedParenthesesError,
} from './calculus.error';

@Injectable()
export class CalculusService {
  private DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private OPENING_PARENTHESE = '(';
  private CLOSING_PARENTHESE = ')';
  private PLUS = '+';
  private MINUS = '-';
  private TIMES = '*';
  private DIVIDE = '/';

  private OPERATORS = [this.PLUS, this.MINUS, this.TIMES, this.DIVIDE];
  private PARENTHESES = [this.OPENING_PARENTHESE, this.CLOSING_PARENTHESE];
  private OP = [...this.OPERATORS, ...this.PARENTHESES];

  run(input: string): CalculusResponse {
    if (!this.isOnlyValidCharacters(input)) throw new InvalidCharacterError();

    if (!this.isBalancedParentheses(input))
      throw new UnbalancedParenthesesError();

    if (!this.isValidOperators(input)) throw new InvalidOperationError();

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
    const parentheses = [...input].filter(
      (c) => c === this.OPENING_PARENTHESE || c === this.CLOSING_PARENTHESE,
    );

    for (let i = 0; i < parentheses.length; i++) {
      if (parentheses[i] == this.OPENING_PARENTHESE) stack++;
      else if (parentheses[i] == this.CLOSING_PARENTHESE && stack <= 0) {
        balanced = false;
        break;
      } else stack--;
    }

    return balanced && stack == 0;
  }

  private isValidOperators(input: string): boolean {
    const ops = [...input];

    if (
      this.OPERATORS.includes(ops[0]) ||
      this.OPERATORS.includes(ops[ops.length - 1])
    ) {
      return false;
    } else {
      let valid = true;
      for (let i = 1; i < ops.length - 1; i++) {
        if (this.OPERATORS.includes(ops[i])) {
          let previous = ops[i - 1];
          let next = ops[i + 1];
          if (
            this.OPERATORS.includes(previous) ||
            this.OPERATORS.includes(next) ||
            previous === this.OPENING_PARENTHESE ||
            next === this.CLOSING_PARENTHESE
          ) {
            valid = false;
            break;
          }
        }
      }
      return valid;
    }
  }

  private compute(input: string): CalculusResponse {
    let calculus = [...input].reverse();

    const inner = (calc: string[]) => {
      if (calc.length == 0) return 0;

      let stack = [];
      let sign = this.PLUS;
      let num = 0;
      let current = '';

      while (calc.length > 0) {
        current = calc.pop();

        if (this.DIGITS.includes(current)) num = num * 10 + +current;
        else if (current === this.OPENING_PARENTHESE) num = inner(calc);

        if (calc.length === 0 || this.OP.includes(current)) {
          if (sign === this.PLUS) stack.push(num);
          else if (sign === this.MINUS) stack.push(-num);
          else if (sign === this.TIMES) {
            let temp = stack.pop() * num;
            stack.push(temp);
          } else if (sign == this.DIVIDE) {
            let temp = stack.pop() / num;
            stack.push(temp);
          }
          sign = current;
          num = 0;
          if (sign == this.CLOSING_PARENTHESE) break;
        }
      }

      return stack.reduce((a, b) => a + b);
    };

    const result = inner(calculus);

    return { error: false, result: result };
  }
}
