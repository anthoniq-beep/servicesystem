import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesTargetInput } from './dto/create-sales-target.input';
import { UpdateSalesTargetInput } from './dto/update-sales-target.input';

@Injectable()
export class SalesTargetService {
  constructor(private prisma: PrismaService) {}

  async create(createSalesTargetInput: CreateSalesTargetInput) {
    // 检查是否已存在
    const existing = await this.prisma.salesTarget.findFirst({
      where: {
        userId: createSalesTargetInput.userId,
        month: createSalesTargetInput.month,
      },
    });

    if (existing) {
      return this.prisma.salesTarget.update({
        where: { id: existing.id },
        data: { amount: createSalesTargetInput.amount },
      });
    }

    return this.prisma.salesTarget.create({
      data: {
        userId: createSalesTargetInput.userId,
        month: createSalesTargetInput.month,
        amount: createSalesTargetInput.amount,
      },
    });
  }

  findAll(month?: string) {
    return this.prisma.salesTarget.findMany({
      where: month ? { month } : undefined,
      include: {
        user: true,
      },
      orderBy: { month: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.salesTarget.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  update(id: number, updateSalesTargetInput: UpdateSalesTargetInput) {
    return this.prisma.salesTarget.update({
      where: { id },
      data: {
        userId: updateSalesTargetInput.userId,
        month: updateSalesTargetInput.month,
        amount: updateSalesTargetInput.amount,
      },
    });
  }

  remove(id: number) {
    return this.prisma.salesTarget.delete({
      where: { id },
    });
  }
}
