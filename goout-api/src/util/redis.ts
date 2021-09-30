import { Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";

export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addData(key: number, authNum: string, expiration_time: number) {
    await this.cacheManager.set(String(key), authNum, {
      ttl: expiration_time,
    });
  }

  async getData(key: number) {
    return await this.cacheManager.get(String(key));
  }

  async deleteData(key: number) {
    return await this.cacheManager.del(String(key));
  }
}
