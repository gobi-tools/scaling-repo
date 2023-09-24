import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 512 },
    { duration: '1m', target: 512 },
  ],
}

export default function () {
  const flips = randomIntFromInterval(550000, 650000);
  const payload = JSON.stringify({ flips });
  const headers = { headers: { 'Content-Type': 'application/json' }, };
  http.post(`http://localhost/flips`, payload, headers);
  sleep(1);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}