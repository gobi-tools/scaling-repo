import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1 },
    { duration: '1m', target: 1 },
  ],
}

export default function () {
  http.get('http://localhost');
  sleep(1);
}