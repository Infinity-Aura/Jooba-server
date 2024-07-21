import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Order extends Document {
  @Prop()
  userId: string;

  @Prop()
  courseId: string;

  @Prop()
  date: string;

  @Prop()
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
