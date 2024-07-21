import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GoodsSchema } from './schemas/goods.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Goods', schema: GoodsSchema }]),
    UserModule,
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
