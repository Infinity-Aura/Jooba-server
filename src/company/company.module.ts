import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schemas/company.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    UserModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
