const redis = require('redis');

const CACHE_HOST = 'redis://cache:6379';
export const cache = redis.createClient({ url: CACHE_HOST });
