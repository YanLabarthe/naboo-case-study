import { Resolver, Query, Args } from '@nestjs/graphql';
import { PermissionService } from '../permission.service';
import { PermissionMapper } from '../mapper/permission.mapper';
import { PermissionDto } from '../types';
import { RoleDto } from 'src/role/types';

@Resolver('Permission')
export class PermissionResolver {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly permissionMapper: PermissionMapper,
  ) {}

  @Query(() => [PermissionDto])
  async getPermissions(): Promise<PermissionDto[]> {
    const permissions = await this.permissionService.getAll();
    const permissionsDto = (
      await Promise.all(
        permissions.map((permission) =>
          this.permissionMapper.convert(permission),
        ),
      )
    ).filter(
      (permissionDto): permissionDto is RoleDto => permissionDto !== null,
    );
    return permissionsDto;
  }

  @Query(() => PermissionDto)
  async getPermissionById(@Args('id') id: string): Promise<PermissionDto> {
    const permission = await this.permissionService.getById(id);
    return this.permissionMapper.convert(permission);
  }

  @Query(() => PermissionDto)
  async getPermissionByName(
    @Args('name') name: string,
  ): Promise<PermissionDto> {
    const permission = await this.permissionService.getByName(name);
    return this.permissionMapper.convert(permission);
  }
}
