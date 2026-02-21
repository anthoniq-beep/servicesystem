import { Module } from '@nestjs/common';
import { SaleLogService } from './sale-log.service';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [CommissionModule],
  providers: [SaleLogService],
  exports: [SaleLogService],
})
export class SaleLogModule {}
