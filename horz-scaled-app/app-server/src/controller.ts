import { v4 as uuid } from 'uuid';
import { cache } from './cache';
import { queue } from './queue';
import { addToBucket, cacheHitRate, consumerLoadGauge } from './monitoring';

export const flipsController = async (req, res) => {
  const flips = req.body.flips ?? 1;
  addToBucket(req.body.dateTarget);
  
  const cached = await cache.get(flips);

  // if (cached) {
  //   cacheHitRate.inc();
  //   res.status(200).json({ success: true, ...cached });
  // } else {
    const id = uuid();
    await queue.send({ id, flips });
    consumerLoadGauge.inc({ host: process.env.APP_NAME });
    res.status(200).json({ success: true, id, flips, processing: true });
  // }
};