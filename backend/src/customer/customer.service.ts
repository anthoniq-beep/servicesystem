import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerStatus, Role, LeadSourceType } from '@prisma/client';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private prisma: PrismaService) {}

  // Create Lead
  async create(data: any, userId: number) {
    // 1. Check for duplicates (phone)
    const existing = await this.prisma.customer.findUnique({
      where: { phone: data.phone },
    });
    if (existing) {
      throw new Error(`Customer with phone ${data.phone} already exists`);
    }

    // 2. Determine source type (simplified logic, assuming ID passed)
    // In real app, we might need to look up source type
    
    return this.prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        companyName: data.companyName,
        status: CustomerStatus.LEAD,
        sourceId: data.sourceId,
        ownerId: data.ownerId || userId, // Allow assigning owner
        saleLogs: {
          create: {
            actorId: userId,
            stage: 'CHANCE', // Initial stage
            note: 'Lead Created',
          }
        }
      },
    });
  }

  // Find All (Scoped by User Role)
  async findAll(userPayload: any) {
    // Fetch fresh user details to get departmentId
    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!user) throw new Error('User not found');

    const { id, role, departmentId } = user;

    if (role === Role.ADMIN || role === Role.FINANCE || role === Role.HR) {
      // See All
      return this.prisma.customer.findMany({
        include: { 
            owner: true, 
            source: true,
            saleLogs: {
                orderBy: { occurredAt: 'desc' },
                include: { actor: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
      });
    }

    if (role === Role.MANAGER) {
      // Manager: See self and direct subordinates (and their subordinates?)
      // User requirement: "manager和supervisor查看本人及直属下级的销售流程所登记的信息"
      // Usually Manager manages a Department.
      // Let's assume Manager sees all users in their department.
      // Or if they have a specific supervisor hierarchy.
      // Based on seed, Manager manages Department. Supervisor reports to Manager.
      // So Manager should see Department.
      
      if (departmentId) {
          return this.prisma.customer.findMany({
            where: {
              owner: {
                departmentId: departmentId
              }
            },
            include: { 
                owner: true, 
                source: true,
                saleLogs: {
                    orderBy: { occurredAt: 'desc' },
                    include: { actor: true } // Include actor for process view
                }
            },
            orderBy: { updatedAt: 'desc' }
          });
      }
    }

    if (role === Role.SUPERVISOR) {
      // See Subordinates + Self
      // First find subordinates
      const subordinates = await this.prisma.user.findMany({
        where: { supervisorId: id },
        select: { id: true }
      });
      const ids = [id, ...subordinates.map(s => s.id)];
      
      return this.prisma.customer.findMany({
        where: {
          ownerId: { in: ids }
        },
        include: { 
            owner: true, 
            source: true,
            saleLogs: {
                orderBy: { occurredAt: 'desc' },
                include: { actor: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
      });
    }

    // Regular Employee
    return this.prisma.customer.findMany({
      where: {
        ownerId: id
      },
      include: { 
          owner: true, 
          source: true,
          saleLogs: {
            orderBy: { occurredAt: 'desc' },
            include: { actor: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        owner: true,
        source: true,
        saleLogs: {
          include: { actor: true },
          orderBy: { occurredAt: 'desc' }
        },
        contracts: true
      }
    });
  }
}
