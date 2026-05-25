const http = require('http');

const data = JSON.stringify({
  viceId: "smoking",
  mode: "acompanhe",
  startTime: Date.now(),
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/vices',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
