import { Types } from 'mongoose';
import { IPermission } from 'src/permission/types/permission.interface';

export interface IRole {
  _id: Types.ObjectId;
  name: string;
  permissions: IPermission[];
}
