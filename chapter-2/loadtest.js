import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target : 256 },
  ]
}

export default function () {
  http.post('http://localhost/server/flips', { flips: 1000000 });
  sleep(1);
}

export function handleSummary(data) {
  const med = parseFloat(Number(data.metrics.http_req_duration.values.med).toFixed(2));
  const avg = parseFloat(Number(data.metrics.http_req_duration.values.avg).toFixed(2));
  const p90 = parseFloat(Number(data.metrics.http_req_duration.values["p(90)"]).toFixed(2));
  const p95 = parseFloat(Number(data.metrics.http_req_duration.values["p(95)"]).toFixed(2));

  const avg_reqs = parseFloat(Number(data.metrics.http_reqs.values.rate).toFixed(0));
  const max_reqs = data.metrics.vus_max.values.max;

  const failure_rate = parseFloat(Number(data.metrics.http_req_failed.values.rate).toFixed(5));

  const object = { latency: { med, avg, p90, p95 }, rps: { avg: avg_reqs, max: max_reqs, failure: failure_rate } }
  
  return {
    'summary.json': JSON.stringify(object, null, 2)
  };
}
