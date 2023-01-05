import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalculusModule } from './calculus/calculus.module';

@Module({
  imports: [CalculusModule, ConfigModule.forRoot()],
})
export class AppModule {}
