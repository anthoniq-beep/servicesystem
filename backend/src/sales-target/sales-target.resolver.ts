import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SalesTargetService } from './sales-target.service';
import { SalesTarget } from './entities/sales-target.entity';
import { CreateSalesTargetInput } from './dto/create-sales-target.input';
import { UpdateSalesTargetInput } from './dto/update-sales-target.input';

@Resolver(() => SalesTarget)
export class SalesTargetResolver {
  constructor(private readonly salesTargetService: SalesTargetService) {}

  @Mutation(() => SalesTarget)
  createSalesTarget(@Args('createSalesTargetInput') createSalesTargetInput: CreateSalesTargetInput) {
    return this.salesTargetService.create(createSalesTargetInput);
  }

  @Query(() => [SalesTarget], { name: 'salesTargets' })
  findAll(@Args('month', { nullable: true }) month?: string) {
    return this.salesTargetService.findAll(month);
  }

  @Query(() => SalesTarget, { name: 'salesTarget' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.salesTargetService.findOne(id);
  }

  @Mutation(() => SalesTarget)
  updateSalesTarget(@Args('updateSalesTargetInput') updateSalesTargetInput: UpdateSalesTargetInput) {
    return this.salesTargetService.update(updateSalesTargetInput.id, updateSalesTargetInput);
  }

  @Mutation(() => SalesTarget)
  removeSalesTarget(@Args('id', { type: () => Int }) id: number) {
    return this.salesTargetService.remove(id);
  }
}
