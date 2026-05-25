const http = require('http');

const data = JSON.stringify({
  id: 'some_random_id',
  viceId: 'libertesse_sugar',
  type: 'consumption',
  timestamp: Date.now(),
  durationSeconds: 120,
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/vices/log',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMzZGQxYjBlLTc0NjUtNDczOS04NmRlLWRiNDc0Yzg1M2Q4ZSIsImVtYWlsIjoidGlhc21pdHRpQGdtYWlsLmNvbSIsImlhdCI6MTc3OTYzOTU3OSwiZXhwIjoxNzgwMjQ0Mzc5fQ.ZVUEg92hIoK7nnwYj5bBhoUGx4A-Qz5r25J9x8X-nzE'
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
