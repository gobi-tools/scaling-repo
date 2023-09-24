import express from 'express';
import { queue } from './queue';
import { Result, dataSource } from './database';
import { cache } from './cache';

const app = express();
const PORT = 7000;

(async function () {
  await queue.connect();
  console.log('[Consumer] Queue connected');
  await dataSource.initialize();
  console.log('[Consumer] Database connection initialised');
  await cache.connect();
  console.log('[Consumer] Cache connected');

  await queue.consume(async (data) => {
    const { id, flips } = data;

    // calc result
    let heads = 0, tails = 0;
    for (let i = 0; i < flips; i++) {
      const value = Math.random();
      if (value < 0.5) {
        heads += 1;
      } else {
        tails += 1;
      }
    }

    // form final result
    const result = { id, flips, heads, tails };

    // save to DB
    const entity = dataSource.manager.create(Result, result);
    await dataSource.manager.save(entity);

    // save to Cache
    await cache.set(flips, result);
  });
})();