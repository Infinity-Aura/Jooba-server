import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Company extends Document {
  @Prop()
  name: string;

  @Prop()
  country: string;

  @Prop()
  address: string;

  @Prop()
  ownerId: string;

  @Prop()
  logo: string;

  @Prop()
  dateOfEstablishment: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
