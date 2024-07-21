import {
  Controller,
  Get,
  Body,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, parse } from 'path';
import { v4 as uuidV4 } from 'uuid';
import { createReadStream } from 'fs';

import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';

import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { Role } from './enums/role.enum';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profile/images',
    filename: (_, file, cb) => {
      const filename = parse(file.originalname);

      cb(null, `${filename.name}-${uuidV4()}${filename.ext}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateOne(
    @ActiveUser('sub') userId: string,
    @Body() userData: Partial<User>,
  ) {
    this.userService.updateOne(userId, userData);
  }

  @Put('image')
  @UseInterceptors(FileInterceptor('photo', storage))
  @HttpCode(HttpStatus.OK)
  uploadProfileImage(
    @ActiveUser('sub') userId: string,
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
    this.userService.updateOne(userId, { photo: photo.filename });
  }

  @Auth(AuthType.None)
  @Get('profile/:filename')
  @HttpCode(HttpStatus.OK)
  findProfileImage(@Param('filename') filename: string): StreamableFile {
    return new StreamableFile(
      createReadStream(
        join(process.cwd(), `uploads/profile/images/${filename}`),
      ),
    );
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
