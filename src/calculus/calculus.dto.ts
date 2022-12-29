import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { decodeBase64TrimAll } from './calculus.helper';
import { UsesValidOperators } from './calculus.validator';

export class CalculusQueryDto {
  @Transform(({ value }) => decodeBase64TrimAll(value))
  @IsString()
  @UsesValidOperators({
    message:
      'Invalid Operators found. Valid operators are [0-9], *, /, +, -, (, )',
  })
  public query: string;
}
