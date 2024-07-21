import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    private config: ConfigService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  findOne(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async updateOne(userId: string, userData): Promise<void> {
    const filter = { _id: userId };
    const update = { $set: userData };
    const options = { new: true };
    await this.userModel.updateOne(filter, update, options);
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }
}
