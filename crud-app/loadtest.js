import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1 },
    { duration: '1m', target: 1 },
  ],
}

export default function () {
  const flips = 1;
  const payload = JSON.stringify({ flips });
  const headers = { headers: { 'Content-Type': 'application/json' }, };
  http.post(`http://localhost/flips`, payload, headers);
  sleep(1);
}