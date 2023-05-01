import { createClient } from 'redis';

class RedisService {
  client;
  constructor() {
    this.client = createClient({ url: 'redis://127.0.0.1:6379' });
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
}

export default new RedisService();
