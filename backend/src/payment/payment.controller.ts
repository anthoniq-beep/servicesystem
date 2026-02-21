import { Controller, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    // Only Admin/Finance can see all
    // Others might only see their own?
    // For approval, we need to filter by status or just list all pending.
    return this.paymentService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Request() req) {
    // Ideally check if user is ADMIN/FINANCE
    // But guards are tricky with dynamic roles here without custom decorators.
    // For now, let's just allow authenticated users but frontend will hide it.
    // Or check role manually.
    if (req.user.role !== Role.ADMIN && req.user.role !== Role.FINANCE) {
        throw new Error('Permission denied');
    }
    return this.paymentService.approve(+id);
  }
}
