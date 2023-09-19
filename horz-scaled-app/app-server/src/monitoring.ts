import client from 'prom-client';

export const register = new client.Registry();

// Histogram metric for measuring request durations
const requestDurationHistogram = new client.Histogram({
  name: 'app_server_histogram_request_duration_seconds',
  help: 'Histogram of request durations',
  labelNames: ['method', 'route'],

  // Duration buckets, in ms & seconds
  // 5ms, 10ms, 25ms, 50ms, 100ms, 250ms, 500ms, 800ms, 1s, 1.2s, 1.5s, 5s, 10s
  buckets: [0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 0.8, 1, 1.2, 1.5, 5, 10]
});
register.registerMetric(requestDurationHistogram);

register.setDefaultLabels({ app: 'app-server' });

client.collectDefaultMetrics({ register });

export const metricsMiddleware = (req, res, next) => {
  const end = requestDurationHistogram.startTimer();
  res.on('finish', () => {
    end({method: req.method, route: req.originalUrl });
  });
  next();
};

export const metricsEndpoint = async (request, response) => {
  response.setHeader('Content-type', register.contentType);
  response.end(await register.metrics());
};