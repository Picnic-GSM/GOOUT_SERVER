/*
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";

export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async add_redis(name: number, authnum: number, expiration_time: number) {
    await this.redis.set(name, authnum, "EX", expiration_time);
  }

  async get_redis(name: number) {
    return await this.redis.get(name);
  }
}
*/