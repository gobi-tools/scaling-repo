import express from 'express';
import { metricsEndpoint, metricsMiddleware } from './monitoring';
import { dataSource } from './database';
import { flipsController } from './controller';
import { cache } from './cache';
import { queue } from './queue';

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);

router.post('/flips', flipsController);
router.get(`/metrics`, metricsEndpoint);

app.use(`/`, router);

app.listen(PORT, async () => {
  console.log(`App Server listening on port ${PORT}`);
  await dataSource.initialize();
  console.log('[App Server] Database connection initialised');
  await cache.connect();
  console.log('[App Server] Cache connected');
  await queue.connect();
  console.log('[App Server] Queue connected');
});