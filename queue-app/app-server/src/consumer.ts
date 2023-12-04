import express from 'express';

import { queue } from './queue';
import { Result, dataSource } from './database';
import { cache } from './cache';
import { consumerLoadGauge, metricsEndpoint } from './monitoring';

import workerpool from 'workerpool';
const pool = workerpool.pool(); 

const PORT = 7000;
const app = express();

const consumeMessage = (id: string, flips: number) => {
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

  return { id, flips, heads, tails };
};

(async function () {
  await dataSource.initialize();
  await cache.connect();
  console.log('[Consumer] Started');
  
  await queue.consume(async (data) => {
    const { id, flips } = data;
    console.log('[Consumer] Start', id, flips);
    
    pool.exec(consumeMessage, [id, flips])
    .then(async (result) => {
      const entity = dataSource.manager.create(Result, result);
      await dataSource.manager.save(entity);
      await cache.set(flips, result);
      consumerLoadGauge.dec();
      console.log('[Thread] Finished for', id);
    })
    .catch(error => {
      //
    });

    // console.log('Consumer] Finished', id);
  });
})();

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get(`/metrics`, metricsEndpoint);
app.use(`/`, router);
app.listen(PORT, async () => {
  console.log(`[Consumer] Metrics server listening on port ${PORT}`);
});