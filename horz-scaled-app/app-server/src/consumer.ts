import express from 'express';

import { queue } from './queue';
import { Result, dataSource } from './database';
import { cache } from './cache';
import { consumerLoadGauge, metricsEndpoint } from './monitoring';

const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;
const app = express();

(async function () {
  await dataSource.initialize();
  await cache.connect();
  console.log(`[Consumer] ${APP_NAME} DB OK; Cache OK;`);

  await queue.consume(async (data) => {
    const { id, flips } = data;
    console.log('Consuming', id, flips);
    
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

    // decrement gauge
    consumerLoadGauge.dec({ host: APP_NAME });
  });
})();

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get(`/metrics`, metricsEndpoint);
app.use(`/`, router);
app.listen(PORT, async () => {
  console.log(`[Consumer] ${APP_NAME} Metrics server listening on port ${PORT}`);
});