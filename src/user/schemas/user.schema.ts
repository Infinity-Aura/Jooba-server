import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Role } from '../enums/role.enum';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birth: string;

  @Prop()
  gender: string;

  @Prop()
  photo: string;

  @Prop()
  phoneNumber: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
