const redis = require('redis');

import { Result } from "./database";

const CACHE_HOST = 'redis://cache:6379';

export class Cache {

  private client: any;

  async connect() {
    this.client = redis.createClient({ url: CACHE_HOST });
    await this.client.connect();
  }

  async set(flips: number, value: Result) {
    const cacheValue = JSON.stringify(value);
    await this.client.set(this.key(flips), cacheValue);
    console.log('saved to cache', value.id, value.flips);
  }

  async get(flips: number): Promise<Result | undefined> {
    const cacheValue = await this.client.get(this.key(flips));

    if (cacheValue) {
      console.log('read from to cache', !!cacheValue);

      return JSON.parse(cacheValue) as Result;
    }

    return undefined;
  }

  private key(flips: number): string {
    return `flips-${flips}`;
  }
}

export const cache = new Cache();