import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationModule } from './organization/organization.module';
import { CustomerModule } from './customer/customer.module';
import { SaleLogModule } from './sale-log/sale-log.module';
import { SalesTargetModule } from './sales-target/sales-target.module';
import { CommissionModule } from './commission/commission.module';
import { PaymentModule } from './payment/payment.module';
import { ChannelModule } from './channel/channel.module';
import { ExcelModule } from './excel/excel.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationModule,
    CustomerModule,
    SaleLogModule,
    SalesTargetModule,
    CommissionModule,
    PaymentModule,
    ChannelModule,
    ExcelModule,
    StatsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
