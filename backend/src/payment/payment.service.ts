import { Injectable, Logger } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private commissionService: CommissionService,
  ) {}

  async create(createPaymentInput: CreatePaymentInput) {
    const { contractId, amount, paidAt, recorderId } = createPaymentInput;
    
    // 1. Create Payment Record
    const payment = await this.prisma.payment.create({
      data: {
        contractId,
        amount,
        paidAt: new Date(paidAt),
        recorderId,
        isApproved: false, // Default to not approved
      },
    });

    this.logger.log(`Created payment #${payment.id}. Waiting for approval to calculate commissions.`);
    return payment;
  }

  async approve(id: number) {
    // 1. Update status to approved
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        isApproved: true,
        approvedAt: new Date(),
      },
    });

    // 2. Update Commission Records to CONFIRMED
    await this.prisma.commissionRecord.updateMany({
        where: { paymentId: id },
        data: { status: 'CONFIRMED' }
    });

    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany({
        include: { 
            contract: {
                include: { customer: true }
            }, 
            recorder: true 
        }
    });
  }

  findOne(id: number) {
    return this.prisma.payment.findUnique({
        where: { id },
        include: { contract: true, recorder: true }
    });
  }

  update(id: number, updatePaymentInput: UpdatePaymentInput) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
