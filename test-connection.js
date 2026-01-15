const http = require('http');

const options = {
  hostname: 'localhost',
  port: 2005,
  path: '/api/v1/health',
  method: 'GET',
  timeout: 5000
};

console.log('Testing connection to backend health endpoint...');
console.log('URL: http://localhost:2005/api/v1/health');

const req = http.request(options, (res) => {
  let data = '';
  
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', data);
    console.log('\nSUCCESS: Connection to backend established.');
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('\nERROR: Could not connect to backend.');
  console.error('Message:', err.message);
  console.error('Code:', err.code);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('\nERROR: Connection timed out.');
  req.destroy();
  process.exit(1);
});

req.end();
