import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculusService {
  getQuery(query: string): string {
    return 'Query is: ' + query;
  }
}
