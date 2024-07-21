import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';

import { User } from 'src/user/schemas/user.schema';

import { HashingService } from '../hashing/hashing.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import {
  InvalidateRefreshTokenError,
  RefreshTokenStorage,
} from '../refresh-token-ids.storage';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenStorage: RefreshTokenStorage,
  ) {}

  async registration(registrationDto: RegistrationDto) {
    try {
      const { firstName, lastName, email, password, role } = registrationDto;
      const hashedPassword = await this.hashingService.hash(password);

      const user = await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
          gender: user.gender,
          birth: user.birth,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role,
        },
        tokens: await this.generateTokens(user.id, {
          email: user.id,
          role: user.role,
        }),
      };
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';

      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }

      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isEqual = await this.hashingService.compare(password, user.password);

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photo,
        gender: user.gender,
        birth: user.birth,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
      tokens: await this.generateTokens(user.id, {
        email: user.id,
        role: user.role,
      }),
    };
  }

  async logout(userId: string) {
    return await this.refreshTokenStorage.invalidate(userId);
  }

  async getActiveUser(userId: string) {
    const user = await this.userModel.findById(userId);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
      gender: user.gender,
      birth: user.birth,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.userModel.findById(sub);
      const isValid = await this.refreshTokenStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is valid');
      }

      return this.generateTokens(user.id, { email: user.id, role: user.role });
    } catch (err) {
      if (err instanceof InvalidateRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  async generateTokens<T>(userId: string, payload?: T) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        userId,
        this.jwtConfiguration.accessTokenTtl,
        payload,
      ),
      this.signToken(userId, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.refreshTokenStorage.insert(userId, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
