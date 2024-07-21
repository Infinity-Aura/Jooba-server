import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from 'src/user/schemas/user.schema';

import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RolesGuard } from './authorization/guards/roles.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { RefreshTokenStorage } from './refresh-token-ids.storage';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    RefreshTokenStorage,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
