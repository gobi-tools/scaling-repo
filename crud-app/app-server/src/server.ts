import express from 'express';
import { metricsEndpoint, metricsMiddleware } from './monitoring';
import { Result, dataSource } from './database';
import { v4 as uuid } from 'uuid';

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);

router.post('/create', async (req, res) => {
  const id = uuid();
  const value = Math.floor(Math.random() * 100) + 1; // random number between 1 and 100
  const entity = dataSource.manager.create(Result, { id, value });
  await dataSource.manager.save(entity);
  res.status(200).json({ success: true, result: { id, value } });
});

router.get(`/metrics`, metricsEndpoint);

app.use(`/`, router);

app.listen(PORT, async () => {
  console.log(`App Server listening on port ${PORT}`);
  await dataSource.initialize();
  console.log('Database connection initialised');
});