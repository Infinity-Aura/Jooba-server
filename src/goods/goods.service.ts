import { Injectable } from '@nestjs/common';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Goods } from './schemas/goods.schema';

@Injectable()
export class GoodsService {
  constructor(
    private config: ConfigService,
    @InjectModel(Goods.name)
    private goodsModel: Model<Goods>,
    private userService: UserService,
  ) {}

  async create(userId: string, createGoodDto: CreateGoodDto) {
    return await this.goodsModel.create({
      ...createGoodDto,
      supplierId: userId,
    });
  }

  async createBulk(userId: string, createGoodDto: CreateGoodDto[]) {
    return await this.goodsModel.insertMany(createGoodDto.map((good) => ({ ...good, supplierId: userId })));
  }

  findAll() {
    return this.goodsModel.find();
  }

  async findUserGoods(userId: string) {
    const goods = await this.goodsModel.find({ supplierId: userId });

    return goods.map(({ _id, ...good }) => ({
      id: _id,
      ...good,
    }));
  }

  findOne(id: string) {
    return this.goodsModel.findById(id);
  }

  update(id: string, updateGoodDto: UpdateGoodDto) {
    return this.goodsModel.findByIdAndUpdate(id, updateGoodDto);
  }

  remove(id: string) {
    return this.goodsModel.findByIdAndDelete(id);
  }
}
