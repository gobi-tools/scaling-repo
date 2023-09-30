import { v4 as uuid } from 'uuid';
import { Result, dataSource } from './database';

export const flipsController = async (req, res) => {
  const flips = req.body.flips ?? 1;

  let heads = 0, tails = 0;

  for (let i = 0; i < flips; i++) {
    const value = Math.random();
    if (value < 0.5) {
      heads += 1;
    } else {
      tails += 1;
    }
  }

  const id = uuid();
  const result = { id, flips, heads, tails };
  
  const entity = dataSource.manager.create(Result, result);
  await dataSource.manager.save(entity);
  res.status(200).json({ success: true, result });
};