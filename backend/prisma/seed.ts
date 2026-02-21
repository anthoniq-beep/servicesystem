import { PrismaClient, Role, EmployeeStatus, LeadSourceType, CustomerStatus, SaleStage } from '@prisma/client';

const prisma = new PrismaClient({
  // In Prisma 7 preview, if we remove `url` from schema, we must provide an adapter or similar.
  // However, `npx prisma migrate dev` works because it reads `prisma.config.ts`.
  // The generated client seems to expect something.
  // Let's try to trick it or use a different approach.
  // Actually, for seed scripts, we can use the `prisma` global if available, but here we import it.
  // If `datasourceUrl` is not allowed in types but required at runtime when url is missing in schema...
  // Let's try casting to any to bypass TS, which we did, but runtime validation failed with "Unknown property datasources" (when we tried datasources).
  // When we tried `datasourceUrl`, it failed with "Using engine type 'client' requires either 'adapter' or 'accelerateUrl'".
  // This means standard TCP connection string is not enough if `url` is missing in schema AND we are using the new config file approach?
  // Let's try adding `adapter: null` or similar if possible, or just revert to putting `url` back in schema for now to make it work easily.
  // Putting `url = env("DATABASE_URL")` back into schema is the easiest fix for now until Prisma 7 stabilizes or we set up the adapter correctly.
} as any);

async function main() {
  console.log('Start seeding...');

  // 1. Create Departments
  let company = await prisma.department.findFirst({ 
      where: { name: '总公司' },
      include: { children: true }
  });
  
  if (!company) {
    company = await prisma.department.create({
        data: {
        name: '总公司',
        children: {
            create: [
            { name: '销售一部' },
            { name: '销售二部' },
            { name: '财务部' },
            { name: '人事部' },
            ],
        },
        },
        include: { children: true },
    });
  } else {
      // Ensure children exist
      const childrenNames = ['销售一部', '销售二部', '财务部', '人事部'];
      for (const name of childrenNames) {
          const exists = await prisma.department.findFirst({ where: { name, parentId: company.id } });
          if (!exists) {
              await prisma.department.create({ data: { name, parentId: company.id } });
          }
      }
      // Re-fetch to get children
      company = await prisma.department.findUnique({
          where: { id: company.id },
          include: { children: true }
      });
  }
  
  if (!company) throw new Error('Failed to create company');

  const salesDept1 = company.children.find(d => d.name === '销售一部');
  const salesDept2 = company.children.find(d => d.name === '销售二部');
  const marketingDept = await prisma.department.findFirst({ where: { name: '市场营销部', parentId: company.id } });
  const networkDept = await prisma.department.findFirst({ where: { name: '网络运营部', parentId: company.id } });
  const financeDept = company.children.find(d => d.name === '财务部');
  const hrDept = company.children.find(d => d.name === '人事部');

  // 2. Create Users
  // Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password123', // In real app, hash this!
      name: '超级管理员',
      phone: '13800000000',
      role: Role.ADMIN,
      status: EmployeeStatus.REGULAR,
      departmentId: company.id,
    },
  });

  // Marketing Manager (Shi Qi)
  const shiqi = await prisma.user.upsert({
    where: { phone: '13700137000' },
    update: {
        role: Role.MANAGER,
        departmentId: marketingDept?.id,
    },
    create: {
      username: '13700137000',
      password: 'password123',
      name: '施琦',
      phone: '13700137000',
      role: Role.MANAGER,
      status: EmployeeStatus.REGULAR,
      departmentId: marketingDept?.id,
    },
  });

  // Network Operation Manager (Tian Jing)
  const tianjing = await prisma.user.upsert({
    where: { phone: '13400134000' },
    update: {
        role: Role.MANAGER,
        departmentId: networkDept?.id,
    },
    create: {
      username: '13400134000',
      password: 'password123',
      name: '田静',
      phone: '13400134000',
      role: Role.MANAGER,
      status: EmployeeStatus.REGULAR,
      departmentId: networkDept?.id,
    },
  });

  // Set managers for departments
  if (marketingDept && shiqi) {
      await prisma.department.update({
          where: { id: marketingDept.id },
          data: { managerId: shiqi.id }
      });
  }

  if (networkDept && tianjing) {
      await prisma.department.update({
          where: { id: networkDept.id },
          data: { managerId: tianjing.id }
      });
  }

  // Marketing Employee (For Commission Rule 3.3)
  const marketingEmployee = await prisma.user.upsert({
    where: { phone: '13900139002' },
    update: {
        role: Role.EMPLOYEE,
        departmentId: marketingDept?.id,
        supervisorId: shiqi.id,
    },
    create: {
      username: '13900139002',
      password: 'password123',
      name: '市场专员A',
      phone: '13900139002',
      role: Role.EMPLOYEE,
      status: EmployeeStatus.REGULAR,
      departmentId: marketingDept?.id,
      supervisorId: shiqi.id,
    },
  });

  // Network Operation Employee (For Commission Rule 3.3)
  const networkEmployee = await prisma.user.upsert({
    where: { phone: '13900139003' },
    update: {
        role: Role.EMPLOYEE,
        departmentId: networkDept?.id,
        supervisorId: tianjing.id,
    },
    create: {
      username: '13900139003',
      password: 'password123',
      name: '网络专员A',
      phone: '13900139003',
      role: Role.EMPLOYEE,
      status: EmployeeStatus.REGULAR,
      departmentId: networkDept?.id,
      supervisorId: tianjing.id,
    },
  });

  // Sales Manager
  const manager = await prisma.user.upsert({
    where: { username: 'manager1' },
    update: {
        departmentId: salesDept1?.id,
        role: Role.MANAGER,
    },
    create: {
      username: 'manager1',
      password: 'password123',
      name: '王经理',
      phone: '13900000001',
      role: Role.MANAGER,
      status: EmployeeStatus.REGULAR,
      departmentId: salesDept1?.id,
    },
  });
  
  // Set manager for department
  if (salesDept1 && manager) {
      await prisma.department.update({
          where: { id: salesDept1.id },
          data: { managerId: manager.id }
      });
  }

  // Sales Manager (Supervisor)
  const supervisor = await prisma.user.upsert({
    where: { username: 'supervisor1' },
    update: {
        departmentId: salesDept1?.id,
        supervisorId: manager.id,
        role: Role.SUPERVISOR,
    },
    create: {
      username: 'supervisor1',
      password: 'password123',
      name: '赵主管',
      phone: '13500000004',
      role: Role.SUPERVISOR,
      status: EmployeeStatus.REGULAR,
      departmentId: salesDept1?.id,
      supervisorId: manager.id,
    },
  });

  // Sales Employee
  const sales1 = await prisma.user.upsert({
    where: { username: 'sales1' },
    update: {
        departmentId: salesDept1?.id,
        supervisorId: supervisor.id,
        role: Role.EMPLOYEE,
    },
    create: {
      username: 'sales1',
      password: 'password123',
      name: '李销售',
      phone: '13700000002',
      role: Role.EMPLOYEE,
      status: EmployeeStatus.REGULAR,
      departmentId: salesDept1?.id,
      supervisorId: supervisor.id,
    },
  });

  // Finance
  const finance = await prisma.user.upsert({
    where: { username: 'finance1' },
    update: {
        departmentId: financeDept?.id,
        role: Role.FINANCE,
    },
    create: {
      username: 'finance1',
      password: 'password123',
      name: '钱财务',
      phone: '13400000005',
      role: Role.FINANCE,
      status: EmployeeStatus.REGULAR,
      departmentId: financeDept?.id,
    },
  });

  // HR
  const hr = await prisma.user.upsert({
    where: { username: 'hr1' },
    update: {
        departmentId: hrDept?.id,
        role: Role.HR,
    },
    create: {
      username: 'hr1',
      password: 'password123',
      name: '孙人事',
      phone: '13300000006',
      role: Role.HR,
      status: EmployeeStatus.REGULAR,
      departmentId: hrDept?.id,
    },
  });

  // 3. Create Lead Sources
  const sourceCompany = await prisma.leadSource.findFirst({ where: { name: '公司官网' } }) 
    || await prisma.leadSource.create({
        data: { name: '公司官网', type: LeadSourceType.COMPANY },
    });

  const sourceIndividual = await prisma.leadSource.findFirst({ where: { name: '个人陌拜' } })
    || await prisma.leadSource.create({
        data: { name: '个人陌拜', type: LeadSourceType.INDIVIDUAL },
    });

  // 4. Create Customers
  const customer1 = await prisma.customer.upsert({
    where: { phone: '13600000003' },
    update: {
        ownerId: sales1.id,
        sourceId: sourceCompany.id,
    },
    create: {
      name: '张三科技',
      phone: '13600000003',
      companyName: '张三科技有限公司',
      status: CustomerStatus.CHANCE,
      sourceId: sourceCompany.id,
      ownerId: sales1.id,
      saleLogs: {
        create: [
          {
            actorId: sales1.id,
            stage: SaleStage.CHANCE,
            note: '从官网获取线索',
          },
        ],
      },
    },
  });

  console.log({ admin, manager, sales1, customer1 });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
