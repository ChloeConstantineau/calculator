import { Injectable } from '@nestjs/common';
import { CalculusQueryDto } from './app.dto';

@Injectable()
export class CalculusService {
  getQuery(query: string): string {
    return 'Query is: ' + query;
  }
}
