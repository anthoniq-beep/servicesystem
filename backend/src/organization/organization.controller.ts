import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() createDepartmentInput: CreateDepartmentInput) {
    return this.organizationService.create(createDepartmentInput);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDepartmentInput: UpdateDepartmentInput) {
    return this.organizationService.update(+id, updateDepartmentInput);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
