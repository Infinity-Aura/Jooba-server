import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/user/enums/role.enum';

import { OrderService } from './order.service';

import { CreateOrderDto, UpdateOrderDto, GetOrderByUserDto } from './dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Roles(Role.Admin)
  @Get('users/all')
  findUsersOrders() {
    return this.orderService.findUsersOrders();
  }

  @Get('user/:userId/course/:courseId')
  findOneByUser(@Param() getOrderByUserDto: GetOrderByUserDto) {
    return this.orderService.findOneByUser(getOrderByUserDto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Roles(Role.Admin)
  @Patch(':id/status')
  updateStatus(
    @Param('id') orderId: string,
    @Body() data: { userId: string; courseId: string; status: string },
  ) {
    return this.orderService.updateStatus({
      orderId,
      userId: data.userId,
      courseId: data.courseId,
      status: data.status,
    });
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
