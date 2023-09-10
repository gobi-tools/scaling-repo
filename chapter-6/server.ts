import express from 'express';
import { metricsEndpoint, metricsMiddleware } from './monitoring';
const app = express();
const PORT = 3000;
const DOMAIN = 'app-server';

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);

router.get('/', async (req, res) => {
  const result = { success: true };
  res.status(200).json(result);
});

router.get(`/metrics`, metricsEndpoint);

app.use(`/${DOMAIN}`, router);

app.listen(PORT, async () => {
  console.log(`App Server listening on port ${PORT}`);
});