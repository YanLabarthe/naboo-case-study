import { Resolver, Query, Args } from '@nestjs/graphql';
import { RoleService } from '../role.service';
import { RoleMapper } from '../mapper/role.mapper';
import { RoleDtoWithPermissions } from '../types';

@Resolver('Role')
export class RoleResolver {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleMapper: RoleMapper,
  ) {}

  @Query(() => [RoleDtoWithPermissions])
  async getRoles(): Promise<RoleDtoWithPermissions[]> {
    const roles = await this.roleService.getAll();
    const rolesDto = await Promise.all(
      roles.map((role) => this.roleMapper.convert(role)),
    );
    return rolesDto;
  }

  @Query(() => RoleDtoWithPermissions)
  async getRole(@Args('id') id: string): Promise<RoleDtoWithPermissions> {
    const role = await this.roleService.getById(id);
    return this.roleMapper.convert(role);
  }

  @Query(() => RoleDtoWithPermissions)
  async getRoleByName(
    @Args('name') name: string,
  ): Promise<RoleDtoWithPermissions> {
    const role = await this.roleService.getByName(name);
    return this.roleMapper.convert(role);
  }
}
