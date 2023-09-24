import { v4 as uuid } from 'uuid';
import { cache } from './cache';
import { queue } from './queue';

export const flipsController = async (req, res) => {
  const flips = req.query.flips ?? 1;

  const cached = await cache.get(flips);

  if (cached) {
    res.status(200).json({ success: true, ...cached });
  } else {
    const id = uuid();
    await queue.send({ id, flips });
    res.status(200).json({ success: true, id, flips, processing: true });
  }
};