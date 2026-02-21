import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleStage, LeadSourceType, Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Calculate commissions for a specific payment
   * @param paymentId The ID of the payment that was just made
   */
  async calculateCommissions(paymentId: number) {
    this.logger.log(`Starting commission calculation for payment #${paymentId}`);

    // 1. Fetch Payment details including Contract, Customer, and Customer's SaleLogs
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        contract: {
          include: {
            customer: {
              include: {
                source: true,
                saleLogs: {
                  where: { isEffective: true }, // Only consider effective logs
                  orderBy: { occurredAt: 'desc' }, // Latest first
                  include: { actor: true },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new Error(`Payment #${paymentId} not found`);
    }

    const customer = payment.contract.customer;
    const saleLogs = customer.saleLogs;
    const amount = new Decimal(payment.amount);
    const quarter = this.getQuarter(payment.paidAt);

    // 2. Identify actors for each stage
    const actors = {
      [SaleStage.CHANCE]: saleLogs.find((l) => l.stage === SaleStage.CHANCE),
      [SaleStage.CALL]: saleLogs.find((l) => l.stage === SaleStage.CALL),
      [SaleStage.TOUCH]: saleLogs.find((l) => l.stage === SaleStage.TOUCH),
      [SaleStage.DEAL]: saleLogs.find((l) => l.stage === SaleStage.DEAL),
    };

    interface CommissionToCreate {
      userId: number;
      saleLogId: number;
      stage: SaleStage;
      rate: number;
      note: string;
    }

    const commissionsToCreate: CommissionToCreate[] = [];

    // 3. Apply Rules

    // Rule 1: CHANCE (Lead Acquisition)
    // - Company Source: Follow-up Sales (1%), Department (2%)
    // - Individual Source: Sales Person (3%)
    if (actors[SaleStage.CHANCE]) {
      const log = actors[SaleStage.CHANCE];
      if (log && log.actor) {
        const actor = log.actor;
        
        if (customer.source.type === LeadSourceType.COMPANY) {
          // Company Source: Sales (1%)
          commissionsToCreate.push({
            userId: actor.id,
            saleLogId: log.id,
            stage: SaleStage.CHANCE,
            rate: 0.01,
            note: '公司渠道线索跟进提成(预留公司成本)',
          });
          
          // Company Source: Department (1%) - Assigned to Department Manager
          if (actor.departmentId) {
            const dept = await this.prisma.department.findUnique({
              where: { id: actor.departmentId },
            });
            if (dept && dept.managerId) {
              commissionsToCreate.push({
                userId: dept.managerId,
                saleLogId: log.id,
                stage: SaleStage.CHANCE,
                rate: 0.01,
                note: `公司渠道线索部门提成(${dept.name})`,
              });
            }
          }

          // Company Source: Company Cost (1%) - Assigned to Admin or specific account?
          // Let's assign to Admin for now to track "Company Revenue/Cost"
          // Or we can just log it. But user says "1%计入公司提成".
          // We can use a special system user or just admin.
          // Let's find admin.
          const adminUser = await this.prisma.user.findFirst({ where: { role: Role.ADMIN } });
          if (adminUser) {
              commissionsToCreate.push({
                  userId: adminUser.id,
                  saleLogId: log.id,
                  stage: SaleStage.CHANCE,
                  rate: 0.01,
                  note: '公司渠道成本预留',
              });
          }

        } else {
          // Individual Source: Sales (3%)
          commissionsToCreate.push({
            userId: actor.id,
            saleLogId: log.id,
            stage: SaleStage.CHANCE,
            rate: 0.03,
            note: '个人渠道线索提成',
          });
        }
      }
    }

    // Rule 2: CALL (Appointment) - 2%
    if (actors[SaleStage.CALL]) {
      const log = actors[SaleStage.CALL];
      if (log) {
        commissionsToCreate.push({
          userId: log.actorId,
          saleLogId: log.id,
          stage: SaleStage.CALL,
          rate: 0.02,
          note: '约访成功提成',
        });
      }
    }

    // Rule 3: TOUCH (Reception) - 2%
    if (actors[SaleStage.TOUCH]) {
      const log = actors[SaleStage.TOUCH];
      if (log) {
        commissionsToCreate.push({
          userId: log.actorId,
          saleLogId: log.id,
          stage: SaleStage.TOUCH,
          rate: 0.02,
          note: '接待完成提成',
        });
      }
    }

    // Rule 4: DEAL (Closing)
    // - Admin (3%)
    // - Manager (3%) -> 1% to Dept Manager
    // - Supervisor (2%)
    // - Employee (1%) -> 2% to Dept Manager
    if (actors[SaleStage.DEAL]) {
      const log = actors[SaleStage.DEAL];
      if (log && log.actor) {
        const dealActor = log.actor;
        let dealRate = 0;
        let note = '';
        let deptCommissionRate = 0;

        if (dealActor.role === Role.ADMIN) {
            dealRate = 0.03;
            note = '成交提成(Admin)';
        } else if (dealActor.role === Role.MANAGER) {
            dealRate = 0.02; // Manager gets 2%? User says "Manager成交的客户1%计入该人员所属部门的提成", assuming total 3% like before? Or extra?
            // "manager成交的客户1%计入该人员所属部门的提成"
            // If total deal commission pool is 3%:
            // Manager takes 2%, Dept takes 1%.
            note = '成交提成(Manager)';
            deptCommissionRate = 0.01;
        } else if (dealActor.role === Role.SUPERVISOR) {
            // User didn't specify Supervisor, keep as is (2%)?
            // Let's assume Supervisor is treated like Employee or Manager?
            // "employee成交的客户2%计入该人员所属部门的提成"
            // Usually Supervisor is higher than Employee.
            // Let's keep Supervisor 2%, Dept 1% (like Manager).
            dealRate = 0.02;
            note = '成交提成(Supervisor)';
            deptCommissionRate = 0.01;
        } else {
            // Employee
            dealRate = 0.01;
            note = '成交提成(Employee)';
            deptCommissionRate = 0.02;
        }

        // 1. Sales Person Commission
        commissionsToCreate.push({
          userId: dealActor.id,
          saleLogId: log.id,
          stage: SaleStage.DEAL,
          rate: dealRate,
          note: note,
        });

        // 2. Department Remainder Commission
        if (deptCommissionRate > 0) {
            if (dealActor.departmentId) {
                const dept = await this.prisma.department.findUnique({
                    where: { id: dealActor.departmentId },
                });
                if (dept && dept.managerId) {
                    // If the actor IS the manager, do they get the dept commission too?
                    // User says "manager成交...1%计入该人员所属部门".
                    // If manager is the head of that dept, they get it themselves?
                    // Or maybe there is a higher dept?
                    // Let's assume they get it as "Dept Commission" separate from "Personal Commission".
                    commissionsToCreate.push({
                        userId: dept.managerId,
                        saleLogId: log.id,
                        stage: SaleStage.DEAL,
                        rate: deptCommissionRate,
                        note: `成交部门提成(${dealActor.name})`,
                    });
                }
            }
        }
      }
    }

    // 4. Save to Database
    const createdRecords: any[] = [];
    for (const item of commissionsToCreate) {
      const commissionAmount = amount.mul(item.rate);
      
      const record = await this.prisma.commissionRecord.create({
        data: {
          userId: item.userId,
          paymentId: paymentId,
          saleLogId: item.saleLogId,
          stage: item.stage,
          baseAmount: amount,
          rate: new Decimal(item.rate),
          amount: commissionAmount,
          quarter: quarter,
          status: 'PENDING', // Initially PENDING
          note: item.note, // Added note
        },
      });
      createdRecords.push(record);
    }

    this.logger.log(`Calculated ${createdRecords.length} commission records for payment #${paymentId}`);
    return createdRecords;
  }

  private getQuarter(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const q = Math.ceil(month / 3);
    return `${year}-Q${q}`;
  }

  // Calculate estimates based on user role
  async getEstimates(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    let whereClause: any = {};

    if (user.role === Role.ADMIN || user.role === Role.FINANCE) {
      // See all
      whereClause = {};
    } else if (user.role === Role.MANAGER) {
      // See department (users in dept)
      const deptMembers = await this.prisma.user.findMany({
        where: { departmentId: user.departmentId },
        select: { id: true }
      });
      whereClause = { userId: { in: deptMembers.map(u => u.id) } };
    } else if (user.role === Role.SUPERVISOR) {
        // See subordinates + self
        const subordinates = await this.prisma.user.findMany({
            where: { supervisorId: userId },
            select: { id: true }
        });
        const ids = [userId, ...subordinates.map(u => u.id)];
        whereClause = { userId: { in: ids } };
    } else {
      // See self - BUT only if status is APPROVED
      whereClause = { 
          userId,
          status: 'APPROVED'
      };
    }

    // Return commission records
    return this.prisma.commissionRecord.findMany({
        where: whereClause,
        include: {
            user: true,
            payment: {
                include: {
                    contract: {
                        include: {
                            customer: true
                        }
                    }
                }
            },
            saleLog: {
                include: {
                    actor: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
  }

  async approve(id: number) {
      return this.prisma.commissionRecord.update({
          where: { id },
          data: { status: 'APPROVED' }
      });
  }

  async update(id: number, data: any) {
      // Update amount or other fields
      // If updating amount, we should probably update rate too?
      // Or just let user edit amount directly.
      // But user asked "edit commission rate, not amount".
      
      const record = await this.prisma.commissionRecord.findUnique({ where: { id } });
      if (!record) throw new Error('Record not found');

      if (data.rate !== undefined) {
          // Recalculate amount based on new rate
          // data.rate might be string if from JSON, ensure decimal
          const newRate = new Decimal(data.rate);
          const newAmount = record.baseAmount.mul(newRate);
          
          return this.prisma.commissionRecord.update({
              where: { id },
              data: {
                  rate: newRate,
                  amount: newAmount,
                  note: data.note,
              }
          });
      }

      return this.prisma.commissionRecord.update({
          where: { id },
          data: {
              note: data.note, 
          }
      });
  }
}
