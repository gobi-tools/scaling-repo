import express from 'express';
import { bucketsEndpoint, metricsEndpoint, metricsMiddlewareWithHost } from './monitoring';
import { dataSource } from './database';
import { flipsController } from './controller';
import { cache } from './cache';
import path from 'path';
var cors = require('cors')

const app = express();
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;

const router = express.Router();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddlewareWithHost(APP_NAME));
app.use(express.static(path.join(__dirname, 'public')));

router.post('/flips', flipsController);
router.get(`/metrics`, metricsEndpoint);
router.get('/buckets', bucketsEndpoint);

router.get('/stats', async(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.use(`/`, router);

app.listen(PORT, async () => {
  await dataSource.initialize();
  await cache.connect();
  console.log(`[App Server] Host ${APP_NAME} listening on port ${PORT}. DB OK, Cache OK.`);
});