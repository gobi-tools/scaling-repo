import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1 },
    { duration: '1m', target: 1 },
  ],
}

export default function () {
  const potentialFlips = [1, 10, 1000, 10000, 100000, 500000, 1000000];
  const flipIndex = randomIntFromInterval(0, 6);
  const flips = potentialFlips[flipIndex];
  const payload = JSON.stringify({ flips });
  const headers = { headers: { 'Content-Type': 'application/json' }, };
  http.post(`http://localhost/flips`, payload, headers);
  sleep(1);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}