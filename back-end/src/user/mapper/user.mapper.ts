import { Injectable } from '@nestjs/common';
import { User } from '../schema/user.schema';
import {
  UserDto,
  UserDtoWithRoles,
  UserDtoWithRolesAndPermissions,
} from '../types/user.dto';
import { Mapper } from 'src/utils/mapper';
import { RoleMapper } from 'src/role/mapper/role.mapper';

@Injectable()
export class UserMapper
  implements
    Mapper<User, UserDto | UserDtoWithRoles | UserDtoWithRolesAndPermissions>
{
  constructor(private readonly roleMapper: RoleMapper) {}

  async convert(
    user: User,
  ): Promise<UserDto | UserDtoWithRoles | UserDtoWithRolesAndPermissions> {
    const basicUserDto: UserDto = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    if (!user.roles || user.roles.length === 0) {
      return basicUserDto;
    }

    const rolesDtoWithPermissions = await Promise.all(
      user.roles.map(async (role) => this.roleMapper.convert(role)),
    );

    return {
      ...basicUserDto,
      roles: rolesDtoWithPermissions,
    };
  }
}
