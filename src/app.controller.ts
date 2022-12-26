import { Controller, Get, Query } from '@nestjs/common';
import { CalculusQueryDto } from './app.dto';
import { CalculusService } from './app.service';

@Controller('calculus')
export class CalculusController {
  constructor(private readonly calculusService: CalculusService) {}

  @Get()
  getCalculus(@Query() input: CalculusQueryDto): string {
    return this.calculusService.getQuery(input.query);
  }
}
