import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserService } from 'src/user/user.service';

import { Order } from './schemas/order.schema';

import { CreateOrderDto, UpdateOrderDto, GetOrderByUserDto } from './dto';

@Injectable()
export class OrderService {
  constructor(
    private config: ConfigService,
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    private userService: UserService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.orderModel.create(createOrderDto);
  }

  findAll() {
    return this.orderModel.find();
  }

  async findUsersOrders() {
    const orders = await this.orderModel.find();

    return Promise.all(
      orders.map(async (order) => {
        const user = await this.userService.findOne(order.userId);

        return {
          courseId: order.courseId,
          date: order.date,
          status: order.status,
          userId: order.userId,
          id: order._id,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userEmail: user.email,
        };
      }),
    );
  }

  findOne(id: string) {
    return this.orderModel.findById(id);
  }

  findOneByUser(getOrderByUserDto: GetOrderByUserDto) {
    return this.orderModel.findOne(getOrderByUserDto);
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto);
  }

  async updateStatus({
    orderId,
    userId,
    courseId,
    status,
  }: {
    orderId: string;
    userId: string;
    courseId: string;
    status: string;
  }) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
