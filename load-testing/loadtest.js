import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  // stages: [
  //   { duration: '2m', target: 100 },
  // ],
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 250,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 80,
      maxVUs: 800,
    },
  },
}

export default function () {
  const flips = randomIntFromInterval(550000, 650000);
  const dateTarget = new Date();
  const payload = JSON.stringify({ flips, dateTarget });
  const headers = { headers: { 'Content-Type': 'application/json' }, };
  http.post(`http://localhost/flips`, payload, headers);
  // sleep(1);
  // sleep(1 / 4);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
