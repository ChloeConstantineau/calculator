import { Module } from '@nestjs/common';
import { CalculusModule } from './calculus/calculus.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule, CalculusModule],
})
export class AppModule {}
