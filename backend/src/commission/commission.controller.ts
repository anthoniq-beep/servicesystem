import { Controller, Get, UseGuards, Request, Patch, Param, Body, Put } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

@Controller('commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('estimates')
  getEstimates(@Request() req) {
    return this.commissionService.getEstimates(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Request() req) {
      // Only Admin or Manager/Supervisor can approve?
      // Requirement: "Direct Leader & Admin approve".
      // Let's allow Manager+ to approve for now.
      if (req.user.role === Role.EMPLOYEE) {
          throw new Error('Permission denied');
      }
      return this.commissionService.approve(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
      if (req.user.role !== Role.ADMIN && req.user.role !== Role.MANAGER) {
          throw new Error('Permission denied');
      }
      return this.commissionService.update(+id, data);
  }
}
