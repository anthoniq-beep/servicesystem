import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getTeamStats(userId: number, monthStr?: string) {
    // 1. Get user role
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // ... Determine target users (same as before) ...
    // Copying logic for brevity
    let targetUsers: { id: number; name: string; role: Role }[] = [];
    if (user.role === Role.ADMIN) {
      targetUsers = await this.prisma.user.findMany({
        where: { 
            department: {
                name: { in: ['市场营销部', '网络运营部', '销售一部', '销售二部'] }
            },
            status: { not: 'TERMINATED' } 
        },
        select: { id: true, name: true, role: true }
      });
    } else if (user.role === Role.MANAGER) {
      targetUsers = await this.prisma.user.findMany({
        where: { departmentId: user.departmentId, status: { not: 'TERMINATED' } },
        select: { id: true, name: true, role: true }
      });
    } else if (user.role === Role.SUPERVISOR) {
      targetUsers = await this.prisma.user.findMany({
        where: { 
            OR: [{ supervisorId: userId }, { id: userId }],
            status: { not: 'TERMINATED' }
        },
        select: { id: true, name: true, role: true }
      });
    } else {
      targetUsers = [{ id: user.id, name: user.name, role: user.role }];
    }

    // 3. Aggregate stats
    // Handle Month Selection
    const now = new Date();
    let startOfMonth: Date;
    let endOfMonth: Date;

    if (monthStr) {
        // monthStr format: "YYYY-MM"
        const [year, month] = monthStr.split('-').map(Number);
        startOfMonth = new Date(year, month - 1, 1);
        endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    } else {
        startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    
    const queryMonth = startOfMonth.toISOString().slice(0, 7);

    const stats = await Promise.all(targetUsers.map(async (u) => {
        // ... Queries using startOfMonth and endOfMonth ...
        const leadCount = await this.prisma.customer.count({
            where: { 
                ownerId: u.id, 
                createdAt: { gte: startOfMonth, lte: endOfMonth }
            }
        });

        const chanceCount = await this.prisma.saleLog.count({
            where: {
                actorId: u.id,
                stage: 'CHANCE',
                occurredAt: { gte: startOfMonth, lte: endOfMonth }
            }
        });

        const callCount = await this.prisma.saleLog.count({
            where: {
                actorId: u.id,
                stage: 'CALL',
                occurredAt: { gte: startOfMonth, lte: endOfMonth }
            }
        });

        const touchCount = await this.prisma.saleLog.count({
            where: {
                actorId: u.id,
                stage: 'TOUCH',
                occurredAt: { gte: startOfMonth, lte: endOfMonth }
            }
        });

        const dealCount = await this.prisma.saleLog.count({
            where: {
                actorId: u.id,
                stage: 'DEAL',
                occurredAt: { gte: startOfMonth, lte: endOfMonth }
            }
        });

        const contractAmount = await this.prisma.contract.aggregate({
            where: {
                customer: { ownerId: u.id },
                signedAt: { gte: startOfMonth, lte: endOfMonth }
            },
            _sum: { amount: true }
        });

        const target = await this.prisma.salesTarget.findFirst({
            where: {
                userId: u.id,
                month: queryMonth
            }
        });

        return {
            id: u.id,
            name: u.name,
            role: u.role,
            leadCount,
            chanceCount,
            callCount,
            touchCount,
            dealCount,
            contractAmount: Number(contractAmount._sum.amount || 0),
            targetAmount: Number(target?.amount || 0),
            completionRate: target?.amount 
                ? Number((Number(contractAmount._sum.amount || 0) / Number(target.amount) * 100).toFixed(2)) 
                : 0
        };
    }));

    return stats;
  }
}
