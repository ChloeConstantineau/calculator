import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalculusModule } from './calculus/calculus.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule, CalculusModule, ConfigModule.forRoot()],
})
export class AppModule {}
