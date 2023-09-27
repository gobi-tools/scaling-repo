import client from 'prom-client';
import os from "os";

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

register.setDefaultLabels({ app: 'app-server' });

client.collectDefaultMetrics({ register });

export function metricsMiddlewareWithHost(host: string) {
  return (req, res, next) => {
    const end = requestDurationHistogram.startTimer();
    res.on('finish', () => {
      end({method: req.method, route: req.originalUrl, host, });
    });
    next();
  };
};

// export const metricsMiddleware = (req, res, next) => {
//   const end = requestDurationHistogram.startTimer();
//   res.on('finish', () => {
//     end({method: req.method, route: req.originalUrl, host: os.hostname() });
//   });
//   next();
// };

export const metricsEndpoint = async (request, response) => {
  response.setHeader('Content-type', register.contentType);
  response.end(await register.metrics());
};