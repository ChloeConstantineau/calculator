import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { decodeBase64TrimAll, encodeBase64 } from './calculus.helper';

export class CalculusQueryDto {
  @ApiProperty({
    description:
      'A string containing the operation to be executed encoded in Base64.',
    default: encodeBase64('1+1'),
  })
  @Transform(({ value }) => decodeBase64TrimAll(value))
  @IsString()
  public query: string;
}

export interface CalculusResponse {
  error: boolean;
  result: number;
}
