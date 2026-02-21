import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SaleLogService } from '../sale-log/sale-log.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly saleLogService: SaleLogService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCustomerDto: any, @Request() req) {
    return this.customerService.create(createCustomerDto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.customerService.findAll(req.user); 
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  // Add Log
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/log')
  addLog(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.saleLogService.create(+id, data, req.user.userId);
  }
}
