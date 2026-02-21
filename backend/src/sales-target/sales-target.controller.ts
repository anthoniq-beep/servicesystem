import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { SalesTargetService } from './sales-target.service';
import { CreateSalesTargetInput } from './dto/create-sales-target.input';
import { UpdateSalesTargetInput } from './dto/update-sales-target.input';
import { AuthGuard } from '@nestjs/passport';

@Controller('sales-target')
export class SalesTargetController {
  constructor(private readonly salesTargetService: SalesTargetService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSalesTargetInput: CreateSalesTargetInput) {
    return this.salesTargetService.create(createSalesTargetInput);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query('month') month?: string) {
    return this.salesTargetService.findAll(month);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesTargetService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSalesTargetInput: UpdateSalesTargetInput) {
    return this.salesTargetService.update(+id, updateSalesTargetInput);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesTargetService.remove(+id);
  }
}
