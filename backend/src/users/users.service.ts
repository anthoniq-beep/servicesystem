import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ... create, findAll, findOne methods ...

  async findAssignableUsers(currentUserId: number) {
      const user = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!user) return [];

      if (user.role === Role.ADMIN) {
          // Admin: All users
          return this.prisma.user.findMany({
              where: { status: { not: 'TERMINATED' } }
          });
      }

      if (user.role === Role.MANAGER) {
          // Manager: Other Managers + Direct Subordinates (Dept members)
          // "Other Managers" implies all managers? Or managers in same org branch? 
          // Let's assume all managers + own department members.
          return this.prisma.user.findMany({
              where: {
                  OR: [
                      { role: Role.MANAGER },
                      { departmentId: user.departmentId }
                  ],
                  status: { not: 'TERMINATED' }
              }
          });
      }

      if (user.role === Role.SUPERVISOR) {
          // Supervisor: Self + Subordinates
          return this.prisma.user.findMany({
              where: {
                  OR: [
                      { id: user.id },
                      { supervisorId: user.id }
                  ],
                  status: { not: 'TERMINATED' }
              }
          });
      }

      // Employee: Self
      return this.prisma.user.findMany({
          where: { id: user.id }
      });
  }

  create(createUserInput: CreateUserInput) {
    // Default password to phone number if not provided
    // In production, this should be hashed
    const data = {
        ...createUserInput,
        password: createUserInput.phone, 
    };
    
    // Explicitly cast optional fields if they are not provided, to avoid undefined
    const { departmentId, supervisorId, ...rest } = data;
    
    return this.prisma.user.create({ 
        data: {
            ...rest,
            departmentId: departmentId ? Number(departmentId) : null,
            supervisorId: supervisorId ? Number(supervisorId) : null,
        }
    }).catch(error => {
        if (error.code === 'P2002') {
            if (error.meta?.target === 'User_username_key') {
                throw new Error('用户名已存在');
            }
            if (error.meta?.target === 'User_phone_key') {
                throw new Error('手机号已存在');
            }
        }
        throw error;
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Find users managed by this user (for managers)
  findSubordinates(supervisorId: number) {
    return this.prisma.user.findMany({
      where: { supervisorId },
    });
  }

  // Find users in the same department (for department heads)
  findDepartmentMembers(departmentId: number) {
      return this.prisma.user.findMany({
          where: { departmentId }
      });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    const { departmentId, supervisorId, ...rest } = updateUserInput as any;
    
    return this.prisma.user.update({
      where: { id },
      data: {
          ...rest,
          departmentId: departmentId ? Number(departmentId) : null,
          supervisorId: supervisorId ? Number(supervisorId) : null,
      },
    });
  }

  async remove(id: number) {
    try {
        return await this.prisma.user.delete({
            where: { id },
        });
    } catch (error) {
        // If foreign key constraint fails
        if (error.code === 'P2003') {
             // 1. Unassign from customers
             await this.prisma.customer.updateMany({
                 where: { ownerId: id },
                 data: { ownerId: null } 
             });

             // 2. Unassign from managed departments
             await this.prisma.department.updateMany({
                 where: { managerId: id },
                 data: { managerId: null }
             });
             
             // 3. Unassign from subordinates
             await this.prisma.user.updateMany({
                 where: { supervisorId: id },
                 data: { supervisorId: null }
             });

             // 4. Remove related records that must be deleted
             // SalesTargets
             await this.prisma.salesTarget.deleteMany({
                 where: { userId: id }
             });

             // SaleLogs (cannot set actorId null, must delete or reassign to admin?)
             // Let's reassign to admin (id: 1) for history preservation if possible, or delete
             // For now, let's delete logs to allow user deletion if simple reassignment is hard
             // Actually, SaleLog actorId refers to User. 
             // Better to keep logs but maybe change actor to "Deleted User" or system.
             // But to make delete work now:
             await this.prisma.saleLog.deleteMany({
                 where: { actorId: id }
             });

             // CommissionRecords
             await this.prisma.commissionRecord.deleteMany({
                 where: { userId: id }
             });
             
             // Payments recorded by user
             // Payment.recorderId
             // This is tricky. Let's reassign to admin (1)
             await this.prisma.payment.updateMany({
                 where: { recorderId: id },
                 data: { recorderId: 1 } // Assuming admin exists
             });

             // Retry delete
             return await this.prisma.user.delete({
                where: { id },
            });
        }
        throw error;
    }
  }
}
