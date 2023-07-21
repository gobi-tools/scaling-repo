import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 50 },
    { duration: '30s', target: 140 },
    { duration: '30s', target: 256 },
    { duration: '30s', target: 512 },
    { duration: '30s', target: 1024 },
    { duration: '60s', target: 4096 }, // scenario 1 limit
    { duration: '60s', target: 8192 },
    { duration: '60s', target: 16384 }, // secenario 2.1 limit (w/ just more worker connections) 
  ]
}

export default function () {
  http.get('http://localhost/');
  sleep(1);
}