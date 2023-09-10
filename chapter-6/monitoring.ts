import client from 'prom-client';

export const register = new client.Registry();

export const requestDurationSummary = new client.Summary({
  name: 'app_server_summary_request_duration_seconds',
  help: 'Summary of request durations',
  labelNames: ['method', 'route'],
  percentiles: [0.5, 0.75, 0.9, 0.95, 0.99]
});
register.registerMetric(requestDurationSummary);

register.setDefaultLabels({ app: 'app-server' });

client.collectDefaultMetrics({ register });

export const metricsMiddleware = (req, res, next) => {
  const end = requestDurationSummary.startTimer();
  res.on('finish', () => {
    end({method: req.method, route: req.originalUrl });
  });
  next();
};

export const metricsEndpoint = async (request, response) => {
  response.setHeader('Content-type', register.contentType);
  response.end(await register.metrics());
};