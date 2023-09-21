import { v4 as uuid } from 'uuid';
import { Result, dataSource } from './database';
import { cache } from './cache';

export const flipsController = async (req, res) => {
  const flips = req.query.flips ?? 1;

  // figure out cache situation
  const key = `flips-${flips}`;
  const cacheValue = await cache.get(key);

  if (cacheValue) {
    const result = JSON.parse(cacheValue);
    res.status(200).json({ success: true, result });
  } else {
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
    const id = uuid();
    const result = { id, flips, heads, tails };

    // save to DB
    const entity = dataSource.manager.create(Result, result);
    await dataSource.manager.save(entity);

    // save to Cache
    const cacheValue = JSON.stringify(result);
    await cache.set(key, cacheValue);

    res.status(200).json({ success: true, result });
  }
};