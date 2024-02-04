import { Types } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';

export interface ISignInUser {
  email: string;
  password: string;
}

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  token?: string;
  roles: Types.ObjectId[] | Role[];
}
