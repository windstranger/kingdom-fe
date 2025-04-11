import { WebSocketServer } from 'ws';
import { parse } from 'url';
import http from 'http';

export class Player {
  constructor(ws, playerName) {
    this.websocket = ws;
    this.info = {
      playerName,
      hasServer: false,
    };
  }
}
const server = http.createServer({});

const wss = new WebSocketServer({ server });
const connections = [];

function extractPlayerName(request) {
  const { query } = parse(request.url, true);
  return query.playerName || crypto.randomUUID();
}

function broadcast(jsonData) {
  const message = JSON.stringify(jsonData);
  for (const player of connections) {
    player.websocket.send(message);
  }
}

wss.on('connection', (ws, req) => {
  const playerName = extractPlayerName(req);
  let existing = connections.find((p) => p.info.playerName === playerName);

  if (existing) {
    ws.send(JSON.stringify({ type: 'error', message: 'player exists' }));
    ws.close();
    return;
  }

  const player = new Player(ws, playerName);
  connections.push(player);
  broadcast({ type: 'players', data: connections.map((p) => p.info) });

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log(msg);

    if (msg.type === 'sdp' || msg.type === 'icecandidate') {
      const target = connections.find((p) => p.info.playerName === msg.remoteId);
      if (target) {
        target.websocket.send(JSON.stringify(msg));
      }
    }

    if (msg.type === 'dropServer') {
      const me = connections.find((p) => p.info.playerName === msg.fromId);
      if (me) me.info.hasServer = false;
      // broadcast(msg);
      broadcast({ type: 'players', data: connections.map((p) => p.info) });
    }

    if (msg.type === 'newServer') {
      const me = connections.find((p) => p.info.playerName === msg.fromId);
      if (me) {
        me.info.hasServer = true;
        broadcast({ type: 'players', data: connections.map((p) => p.info) });
      }
    }
  });

  ws.on('close', () => {
    const index = connections.findIndex((p) => p.info.playerName === playerName);
    if (index !== -1) connections.splice(index, 1);
    broadcast({ type: 'players', data: connections.map((p) => p.info) });
    console.log(`Disconnected: ${playerName}`);
  });

  ws.on('error', console.error);
});

server.listen(8765, () => {
  console.log('WebSocket server running at https://0.0.0.0:8765');
});
