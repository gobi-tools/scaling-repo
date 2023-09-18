import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 128 },
  ],
}

export default function () {
  http.post('http://localhost/flips?flips=1');
  sleep(1);
}