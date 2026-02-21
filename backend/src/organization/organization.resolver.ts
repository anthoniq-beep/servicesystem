import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';

@Resolver(() => Department)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => Department)
  createDepartment(@Args('createDepartmentInput') createDepartmentInput: CreateDepartmentInput) {
    return this.organizationService.create(createDepartmentInput);
  }

  @Query(() => [Department], { name: 'departments' })
  findAll() {
    return this.organizationService.findAll();
  }

  @Query(() => Department, { name: 'department' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.organizationService.findOne(id);
  }

  @Mutation(() => Department)
  updateDepartment(@Args('updateDepartmentInput') updateDepartmentInput: UpdateDepartmentInput) {
    return this.organizationService.update(updateDepartmentInput.id, updateDepartmentInput);
  }

  @Mutation(() => Department)
  removeDepartment(@Args('id', { type: () => Int }) id: number) {
    return this.organizationService.remove(id);
  }
}
