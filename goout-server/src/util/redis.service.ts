import { Injectable } from "@nestjs/common";
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async add_redis(name, authnum) {
    await this.redis.set(name, authnum,'EX',180);
  }

  async get_redis(name) {
    return await this.redis.get(name);
  }
}
