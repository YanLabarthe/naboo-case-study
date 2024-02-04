import { Types } from 'mongoose';

export interface IPermission {
  _id: Types.ObjectId;
  name: string;
}
