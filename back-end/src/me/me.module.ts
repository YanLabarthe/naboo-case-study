import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MeResolver } from './resolver/me.resolver';
import { ActivityModule } from 'src/activity/activity.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ActivityModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [MeResolver],
})
export class MeModule {}
