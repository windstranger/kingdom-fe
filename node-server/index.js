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

  // Обработка сообщений от клиента
  socket.on('message', (message) => {
    console.log('Received message:', message);
    // Эхо-сообщение обратно клиенту
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
