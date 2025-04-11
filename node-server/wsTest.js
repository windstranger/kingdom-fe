import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// const cert = readFileSync('../192.168.0.174.pem');
// const key = readFileSync('../192.168.0.174-key.pem');
// const server = createServer({
//   cert: readFileSync('../cert.pem'),
//   key: readFileSync('../key.pem'),
// });
const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log('connected new user');
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

server.listen(7777);
