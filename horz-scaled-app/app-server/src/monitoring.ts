import client from 'prom-client';
import moment from 'moment';

const buckets = {};

export const addToBucket = (dateTarget: Date) => {
  const date = dateTarget ?? new Date();
  const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');

  if (!buckets[formattedDate]) {
    buckets[formattedDate] = 1;
  } else {
    buckets[formattedDate] = buckets[formattedDate] + 1;
  }
};

export const register = new client.Registry();

// Histogram metric for measuring request durations
const requestDurationHistogram = new client.Histogram({
  name: 'app_server_histogram_request_duration_seconds',
  help: 'Histogram of request durations',
  labelNames: ['method', 'route', 'host'],

  // Duration buckets, in ms & seconds
  // 5ms, 10ms, 25ms, 50ms, 100ms, 250ms, 500ms, 800ms, 1s, 1.2s, 1.5s, 5s, 10s
  buckets: [0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 0.8, 1, 1.2, 1.5, 5, 10]
});
register.registerMetric(requestDurationHistogram);

export const consumerLoadGauge = new client.Gauge({
  name: 'consumer_load_gauge',
  help: 'Consumer load gauge',
  labelNames: ['host'],
});
register.registerMetric(consumerLoadGauge);

export const cacheHitRate = new client.Counter({
  name: 'cache_hit_rate',
  help: 'Cache hit rate',
});
register.registerMetric(cacheHitRate)

register.setDefaultLabels({ app: 'app-server' });

client.collectDefaultMetrics({ register });

export function metricsMiddlewareWithHost(host: string) {
  return (req, res, next) => {
    const end = requestDurationHistogram.startTimer();
    res.on('finish', () => {
      // if (!req.originalUrl.includes('/metrics') && !req.originalUrl.includes('/stats')) {
      //   addToBucket(req.body.dateTarget);
      // }
      end({method: req.method, route: req.originalUrl, host, });
    });
    next();
  };
};

export const metricsEndpoint = async (request, response) => {
  response.setHeader('Content-type', register.contentType);
  response.end(await register.metrics());
};

export const bucketsEndpoint = async (request, response) => {
  response.status(200).json(buckets);
};