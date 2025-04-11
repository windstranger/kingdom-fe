import express from 'express';
import fs from 'fs';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const serverOptions = {
  key: fs.readFileSync('../key.pem'),
  cert: fs.readFileSync('../cert.pem'),
};

// Создание Express приложения
const app = express();

// Создание HTTPS сервера с использованием сертификатов
const server = createServer(serverOptions, app);

// Массив для хранения подключений игроков
const connections = [];


// Инициализация Socket.io на сервере
const io = new Server(server, {
  cors: {
    origin: 'https://localhost:5173', // Указываем ваш dev-сервер на порту 5173
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

// Обработка подключения WebSocket
io.on('connection', (socket) => {
  console.log('New WebSocket connection established');

  // Отправка приветственного сообщения клиенту
  socket.emit('message', 'Welcome to the WebSocket server!');
  console.log('New connection');

  const queryParams = socket.handshake.query;
  const playerName = extractPlayerName(queryParams);

  // Проверка, существует ли уже такой игрок
  const existingPlayer = connections.find(player => player.playerName === playerName);

  if (!existingPlayer) {
    // Новый игрок
    connections.push({ playerName, socket });

    // Отправка списка всех игроков
    const players = connections.map(connection => connection.playerName);
    broadCastMessage({ data: players, type: 'players' });
  } else {
    // Если игрок уже существует, закрываем соединение
    socket.emit('error', { message: 'Player exists', type: 'error' });
    socket.disconnect();
    return;
  }

  // Обработка сообщений от клиента
  socket.on('message', (message) => {
    console.log('Received message:', msg);

    if (msg.type === 'sdp' || msg.type === 'icecandidate') {
      // Найдем игрока, которому нужно отправить сообщение
      const targetConnection = connections.find(player => player.playerName === msg.remoteId);
      if (targetConnection) {
        targetConnection.socket.emit('message', msg);
      }
    }

    if (msg.type === 'dropServer') {
      // Логика для удаления сервера
      const myConnection = connections.find(player => player.playerName === msg.fromId);
      if (myConnection) {
        myConnection.hasServer = false;
        broadCastMessage(msg);
      }
    }

    if (msg.type === 'newServer') {
      // Логика для добавления нового сервера
      const myConnection = connections.find(player => player.playerName === msg.fromId);
      if (myConnection) {
        myConnection.hasServer = true;
        const players = connections.map(connection => connection.playerName);
        broadCastMessage({ data: players, type: 'players' });
      }
    }
  });
    socket.emit('message', `Echo: ${message}`);
  });

  // Обработка отключения клиента
  socket.on('disconnect', () => {
    console.log('A client has disconnected');
  });
});

// Запуск сервера на порту 8765
server.listen(8765, () => {
  console.log('WebSocket server running on wss://localhost:8765');
});
