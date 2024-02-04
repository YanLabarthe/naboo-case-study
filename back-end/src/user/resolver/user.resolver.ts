import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserMapper } from '../mapper/user.mapper';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  UserDtoWithRoles,
  UserDtoWithRolesAndPermissions,
} from '../types/user.dto';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Query(() => [UserDtoWithRoles])
  @UseGuards(AuthGuard)
  async getUsers(): Promise<UserDtoWithRoles[]> {
    const users = await this.userService.getAll();
    return Promise.all(users.map((user) => this.userMapper.convert(user)));
  }

  @Query(() => UserDtoWithRolesAndPermissions)
  async getUser(
    @Args('id') id: string,
  ): Promise<UserDtoWithRolesAndPermissions> {
    const user = await this.userService.getById(id);
    return this.userMapper.convert(user);
  }
}
