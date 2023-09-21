import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 256 },
  ],
}

export default function () {
  const flips = [1, 10, 1000, 10000, 100000, 500000, 1000000];
  const flipIndex = randomIntFromInterval(0, 6);
  const flip = flips[flipIndex];
  http.post(`http://localhost/flips?flips=${flip}`);
  sleep(1);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}