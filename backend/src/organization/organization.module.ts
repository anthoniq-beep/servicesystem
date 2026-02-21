import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationController } from './organization.controller';

@Module({
  providers: [OrganizationService, OrganizationResolver],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
