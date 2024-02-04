import { Context, Query, Resolver } from '@nestjs/graphql';
import { UserMapper } from '../../user/mapper/user.mapper';
import { UserService } from '../../user/user.service';
import { UserDtoWithRolesAndPermissions } from '../../user/types/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@Resolver('Me')
export class MeResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Query(() => UserDtoWithRolesAndPermissions)
  @UseGuards(AuthGuard)
  async getMe(
    @Context() context: any,
  ): Promise<UserDtoWithRolesAndPermissions> {
    const user = await this.userService.getById(context.user?.id);

    return this.userMapper.convert(user);
  }
}
