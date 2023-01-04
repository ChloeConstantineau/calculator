import { Controller, Get, Query } from '@nestjs/common';
import { CalculusQueryDto, CalculusResponse } from './calculus.dto';
import { CalculusService } from './calculus.service';

@Controller('calculus')
export class CalculusController {
  constructor(private readonly calculusService: CalculusService) {}

  @Get()
  getCalculus(@Query() input: CalculusQueryDto): CalculusResponse {
    return this.calculusService.run(input.query);
  }
}
