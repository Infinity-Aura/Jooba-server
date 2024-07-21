import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    private config: ConfigService,
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
    private userService: UserService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return await this.companyModel.create({ ...createCompanyDto, logo: '' });
  }

  findAll() {
    return this.companyModel.find();
  }

  async findUserCompanies(userId: string) {
    const companies = await this.companyModel.find({ ownerId: userId });

    return companies.map((company) => ({
      id: company._id,
      name: company.name,
      country: company.country,
      address: company.address,
      logo: company.logo,
      dateOfEstablishment: company.dateOfEstablishment,
    }));
  }

  findOne(id: string) {
    return this.companyModel.findById(id);
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto);
  }

  remove(id: string) {
    return this.companyModel.findByIdAndDelete(id);
  }
}
