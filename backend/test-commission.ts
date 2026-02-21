import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PaymentService } from './src/payment/payment.service';
import { PrismaService } from './src/prisma/prisma.service';
import { SaleStage } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const paymentService = app.get(PaymentService);
  const prisma = app.get(PrismaService);

  console.log('--- Starting Commission Test ---');

  // 1. Prepare Data
  // Get Customer and Sales Person
  const customer = await prisma.customer.findFirst({
      where: { name: '张三科技' }
  });
  
  const sales = await prisma.user.findFirst({
      where: { username: 'sales1' }
  });

  const manager = await prisma.user.findFirst({
      where: { username: 'manager1' }
  });

  if (!customer || !sales || !manager) {
      console.error('Missing seed data');
      await app.close();
      return;
  }

  // Ensure SaleLogs exist for DEAL stage (since seed only created CHANCE)
  // Let's create a DEAL log
  await prisma.saleLog.create({
      data: {
          customerId: customer.id,
          actorId: sales.id,
          stage: SaleStage.DEAL,
          note: 'Successfully closed the deal',
      }
  });
  console.log('Created DEAL sale log');

  // Create Contract
  const contract = await prisma.contract.create({
      data: {
          customerId: customer.id,
          amount: 100000,
          signedAt: new Date(),
      }
  });
  console.log('Created Contract');

  // 2. Create Payment
  const payment = await paymentService.create({
      contractId: contract.id,
      amount: 50000, // Partial payment
      paidAt: new Date().toISOString(),
      recorderId: manager.id,
  });
  console.log(`Created Payment #${payment.id}`);

  // 3. Approve Payment (Triggers Calculation)
  await paymentService.approve(payment.id);
  console.log(`Approved Payment #${payment.id}`);

  // 4. Verify Commissions
  const commissions = await prisma.commissionRecord.findMany({
      where: { paymentId: payment.id },
      include: { user: true }
  });

  console.log('\n--- Commission Results ---');
  commissions.forEach(c => {
      console.log(`User: ${c.user.name} (${c.user.role}) | Stage: ${c.stage} | Rate: ${c.rate} | Amount: ${c.amount} | Note: ${c.user.username}`);
  });

  await app.close();
}

bootstrap();
