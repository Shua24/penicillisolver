import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1, // 1 user virtual
  duration: '10s', // Berjalan selama 10 detik
};

export default function () {
  // Test akses halaman utama
  http.get('http://localhost:3000');
  sleep(1);
} 