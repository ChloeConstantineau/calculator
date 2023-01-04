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

  private OPERATORS = ['+', '-', '*', '/'];
  private PARENTHESES = ['(', ')'];
  private OP = [...this.OPERATORS, ...this.PARENTHESES];

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
            this.OPERATORS.includes(next)
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
      let sign = '+';
      let num = 0;
      let current = '';

      while (calc.length > 0) {
        current = calc.pop();

        if (isDigit(current)) num = num * 10 + +current;
        else if (current === '(') num = inner(calc);

        if (calc.length === 0 || this.OP.includes(current)) {
          if (sign === '+') stack.push(num);
          else if (sign === '-') stack.push(-num);
          else if (sign === '*') {
            let temp = stack.pop() * num;
            stack.push(temp);
          } else if (sign == '/') {
            let temp = stack.pop() / num;
            stack.push(temp);
          }
          sign = current;
          num = 0;
          if (sign == ')') break;
        }
      }

      return stack.reduce((a, b) => a + b);
    };

    const result = inner(calculus);

    return { error: false, result: result };
  }
}

function isDigit(input: string): boolean {
  return (
    input === '0' ||
    input === '1' ||
    input === '2' ||
    input === '3' ||
    input === '4' ||
    input === '5' ||
    input === '6' ||
    input === '7' ||
    input === '8' ||
    input === '9'
  );
}
