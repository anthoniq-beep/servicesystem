import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';

@Injectable()
export class OrganizationService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.initDepartments();
  }

  async initDepartments() {
    // Remove deprecated departments
    const deprecated = ['销售一部', '销售二部', '销售一组', '销售二组'];
    await this.prisma.department.deleteMany({
      where: { name: { in: deprecated } }
    });

    const departments = ['市场营销部', '网络运营部', '财务部', '人事部'];
    
    for (const name of departments) {
      const exists = await this.prisma.department.findFirst({
        where: { name },
      });

      if (!exists) {
        await this.prisma.department.create({
          data: { name },
        });
        console.log(`Initialized department: ${name}`);
      } else if (exists.parentId !== null) {
        // Ensure they are top-level to be parallel
        await this.prisma.department.update({
          where: { id: exists.id },
          data: { parentId: null }
        });
      }
    }
  }

  create(createDepartmentInput: CreateDepartmentInput) {
    return this.prisma.department.create({
      data: {
        name: createDepartmentInput.name,
        parentId: createDepartmentInput.parentId,
        managerId: createDepartmentInput.managerId,
      },
    });
  }

  findAll() {
    return this.prisma.department.findMany({
      include: {
        parent: true,
        children: true,
        manager: true,
        users: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        manager: true,
        users: true,
      },
    });
  }

  update(id: number, updateDepartmentInput: UpdateDepartmentInput) {
    return this.prisma.department.update({
      where: { id },
      data: {
        name: updateDepartmentInput.name,
        parentId: updateDepartmentInput.parentId,
        managerId: updateDepartmentInput.managerId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
