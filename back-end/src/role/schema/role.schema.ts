import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Permission } from 'src/permission/schema/permission.schema';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Role.name }] })
  permissions?: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
