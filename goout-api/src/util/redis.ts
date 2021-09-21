import { Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";

export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async add_redis(name: number, authnum: number, expiration_time: number) {
    await this.cacheManager.set(String(name), authnum, {
      ttl: expiration_time,
    });
  }

  async get_redis(name: number) {
    return await this.cacheManager.get(String(name));
  }
  async deleteData(name: number) {
    return await this.cacheManager.del(String(name));
  }
}
