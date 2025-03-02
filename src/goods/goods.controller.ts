import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  create(
    @ActiveUser('sub') userId: string,
    @Body() createGoodDto: CreateGoodDto,
  ) {
    return this.goodsService.create(userId, createGoodDto);
  }

  @Post('bulk')
  createBulk(
    @ActiveUser('sub') userId: string,
    @Body() createGoodDto: CreateGoodDto[],
  ) {
    return this.goodsService.createBulk(userId, createGoodDto);
  }

  @Get()
  findAll() {
    return this.goodsService.findAll();
  }

  @Get('own')
  findUserCompanies(@ActiveUser('sub') userId: string) {
    return this.goodsService.findUserGoods(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(id, updateGoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodsService.remove(id);
  }
}
