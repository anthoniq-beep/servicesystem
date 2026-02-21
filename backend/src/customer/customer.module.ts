import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { SaleLogModule } from '../sale-log/sale-log.module';

@Module({
  imports: [SaleLogModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
