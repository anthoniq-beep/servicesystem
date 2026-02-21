import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';

@Module({
  controllers: [CommissionController],
  providers: [CommissionService],
  exports: [CommissionService], // Export so PaymentModule can use it
})
export class CommissionModule {}
