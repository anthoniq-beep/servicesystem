import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleStage, CustomerStatus } from '@prisma/client';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class SaleLogService {
  constructor(
    private prisma: PrismaService,
    private commissionService: CommissionService
  ) {}

  async create(customerId: number, data: any, actorId: number) {
    // Check if customer already has a DEAL log
    if (data.stage === SaleStage.DEAL) {
        const existingDeal = await this.prisma.saleLog.findFirst({
            where: {
                customerId,
                stage: SaleStage.DEAL
            }
        });
        if (existingDeal) {
            throw new Error('该客户已签约，无法重复签约');
        }
    }

    // 1. Create Log
    const log = await this.prisma.saleLog.create({
      data: {
        customerId,
        actorId,
        stage: data.stage as SaleStage,
        note: data.note,
        isEffective: data.isEffective ?? true,
      },
    });

    // 2. Update Customer Status/Owner if needed
    // e.g. If stage is DEAL, update customer status to DEAL
    if (data.stage === SaleStage.DEAL) {
      // Create Contract if DEAL
      if (data.contractAmount) {
          const contract = await this.prisma.contract.create({
              data: {
                  customerId,
                  amount: data.contractAmount,
                  signedAt: new Date(),
              }
          });

          // Create a mock payment for this contract to trigger commission calculation immediately
          // In real system, this would be separate "Payment" entry
          // But user wants "Calculation" (测算) upon registration
          const payment = await this.prisma.payment.create({
              data: {
                  contractId: contract.id,
                  amount: data.contractAmount,
                  paidAt: new Date(),
                  recorderId: actorId, // Recorder is the sales person for now
                  isApproved: false // Wait for approval
              }
          });

          // Trigger Commission Calculation (Estimate)
          await this.commissionService.calculateCommissions(payment.id);
      }

      await this.prisma.customer.update({
        where: { id: customerId },
        data: { status: CustomerStatus.DEAL, dealAt: new Date() }
      });
    } else if (data.stage === SaleStage.CALL) {
        await this.prisma.customer.update({
            where: { id: customerId },
            data: { status: CustomerStatus.CALL }
        });
    } else if (data.stage === SaleStage.TOUCH) {
        await this.prisma.customer.update({
            where: { id: customerId },
            data: { status: CustomerStatus.TOUCH }
        });
    }

    // Update last contact time
    await this.prisma.customer.update({
        where: { id: customerId },
        data: { lastContactAt: new Date() }
    });

    return log;
  }
}
