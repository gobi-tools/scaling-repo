import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 256 },
  ],
}

export default function () {
  http.post('http://localhost/create');
  sleep(1);
}