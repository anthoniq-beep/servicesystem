import { Module } from '@nestjs/common';
import { SalesTargetService } from './sales-target.service';
import { SalesTargetResolver } from './sales-target.resolver';
import { SalesTargetController } from './sales-target.controller';

@Module({
  controllers: [SalesTargetController],
  providers: [SalesTargetService, SalesTargetResolver]
})
export class SalesTargetModule {}
