const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello');
});
server.listen(3001, 'localhost', () => {
  console.log('Server running');
  process.exit(0);
});
server.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
