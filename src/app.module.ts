import { Module } from '@nestjs/common';
import { CalculusController } from './app.controller';
import { CalculusService } from './app.service';

@Module({
  imports: [],
  controllers: [CalculusController],
  providers: [CalculusService],
})
export class AppModule {}
