import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: process.env.REDIS_CONNECTION_STRING,
      port: +process.env.REDIS_CONNECTION_PORT,
      username: process.env.REDIS_CONNECTION_USERNAME,
      password: process.env.REDIS_CONNECTION_PASSWORD,
    });
  }

  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storeId = await this.redisClient.get(this.getKey(userId));
    if (storeId !== tokenId) {
      throw new InvalidateRefreshTokenError();
    }
    return storeId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
