import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 1024 },
  ],
}

export default function () {
  http.post('http://localhost/flips?flips=100000');
  sleep(1);
}