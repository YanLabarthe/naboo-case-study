import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './role.service';
import { RoleMapper } from './mapper/role.mapper';
import { Role, RoleSchema } from './schema/role.schema';
import { RoleResolver } from './resolver/role.resolver';
import {
  Permission,
  PermissionSchema,
} from 'src/permission/schema/permission.schema';
import { PermissionModule } from 'src/permission/permission.module';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    forwardRef(() => UserModule),
    RoleModule,
    PermissionModule,
  ],
  exports: [RoleService, RoleMapper],
  providers: [RoleService, RoleMapper, RoleResolver],
})
export class RoleModule {}
