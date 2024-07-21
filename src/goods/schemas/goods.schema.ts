import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Goods extends Document {
  @Prop()
  name: string;

  @Prop()
  sale: string;

  @Prop()
  article: string;

  @Prop()
  brand: string;

  @Prop()
  category: string;

  @Prop()
  price: string;

  @Prop()
  availability: boolean;

  @Prop()
  supplierId: string;
}

export const GoodsSchema = SchemaFactory.createForClass(Goods);
