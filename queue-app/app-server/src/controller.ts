import { v4 as uuid } from 'uuid';
import { cache } from './cache';
import { queue } from './queue';
import { cacheHitRate, consumerLoadGauge } from './monitoring';

export const flipsController = async (req, res) => {
  const flips = req.body.flips ?? 1;

  const cached = await cache.get(flips);

  if (cached) {
    cacheHitRate.inc();
    res.status(200).json({ success: true, ...cached });
  } else {
    const id = uuid();
    // important for performance to _NOT_ await the queue send operation 
    await queue.send({ id, flips });
    // send metrics 
    consumerLoadGauge.inc();
    res.status(200).json({ success: true, id, flips, processing: true });
  }
};