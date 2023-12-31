import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  // stages: [
  //   { duration: '2m', target: 600 },
  //   { duration: '2m', target: 600 },
  // ],
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 4000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 500,
      maxVUs: 4000,
    },
  },
}

export default function () {
  const flips = randomIntFromInterval(550000, 650000);
  const dateTarget = new Date();
  const payload = JSON.stringify({ flips, dateTarget });
  const headers = { headers: { 'Content-Type': 'application/json' }, };
  http.post(`http://localhost/flips`, payload, headers);
  sleep(1);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
