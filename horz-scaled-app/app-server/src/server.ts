import express from 'express';
import { metricsEndpoint, metricsMiddlewareWithHost } from './monitoring';
import { dataSource } from './database';
import { flipsController } from './controller';
import { cache } from './cache';

const app = express();
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddlewareWithHost(APP_NAME));

router.post('/flips', flipsController);
router.get(`/metrics`, metricsEndpoint);

app.use(`/`, router);

app.listen(PORT, async () => {
  await dataSource.initialize();
  await cache.connect();
  console.log(`[App Server] Host ${APP_NAME} listening on port ${PORT}. DB OK, Cache OK.`);
});