import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Put,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/user/enums/role.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join, parse } from 'path';
import { v4 as uuidV4 } from 'uuid';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { diskStorage } from 'multer';

export const storage = {
  storage: diskStorage({
    destination: './uploads/company/images',
    filename: (_, file, cb) => {
      const filename = parse(file.originalname);

      cb(null, `${filename.name}-${uuidV4()}${filename.ext}`);
    },
  }),
};

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get('own')
  findUserCompanies(@ActiveUser('sub') userId: string) {
    return this.companyService.findUserCompanies(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Put(':id/logo')
  @UseInterceptors(FileInterceptor('photo', storage))
  @HttpCode(HttpStatus.OK)
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    photo: Express.Multer.File,
  ) {
    this.companyService.update(id, { logo: photo.filename });
  }

  @Auth(AuthType.None)
  @Get('logo/:filename')
  @HttpCode(HttpStatus.OK)
  findLogo(@Param('filename') filename: string): StreamableFile {
    return new StreamableFile(
      createReadStream(
        join(process.cwd(), `uploads/company/images/${filename}`),
      ),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
