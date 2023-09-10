import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1024 },
  ],
}

export default function () {
  http.get('http://localhost/app-server');
  sleep(1);
}