import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { IamModule } from './iam/iam.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { CompanyModule } from './company/company.module';
import { GoodsModule } from './goods/goods.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_STRING),
    UserModule,
    IamModule,
    OrderModule,
    CompanyModule,
    GoodsModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
