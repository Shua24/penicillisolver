import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
};

export default function () {
  // Test landing page
  const res = http.get('http://localhost:3000/api/landing');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
} 