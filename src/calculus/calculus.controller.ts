import { Controller, Get, Query } from '@nestjs/common';
import { CalculusQueryDto } from './calculus.dto';
import { CalculusService } from './calculus.service';

@Controller('calculus')
export class CalculusController {
  constructor(private readonly calculusService: CalculusService) {}

  @Get()
  getCalculus(@Query() input: CalculusQueryDto): string {
    return this.calculusService.getQuery(input.query);
  }
}
