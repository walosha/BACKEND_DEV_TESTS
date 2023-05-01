import { createClient } from 'redis';

class RedisService {
  client;
  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
  }

  async set({ key, value, timeType, time }: any) {
    await this.client.connect();
    await this.client.set(key, value, timeType, time);
    await this.client.disconnect();
  }

  async get(key: string) {
    await this.client.connect();
    const result = await this.client.get(key);
    await this.client.disconnect();
    return result;
  }

  async exists(key: string) {
    await this.client.connect();
    const result = await this.client.exists(key);
    await this.client.disconnect();
    return result;
  }
}

export default new RedisService();
