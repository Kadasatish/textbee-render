const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

let messages = [];

app.post('/sms-handler', (req, res) => {
  const { from, body, timestamp } = req.body;
  const msg = {
    from,
    body,
    timestamp: timestamp || new Date().toISOString()
  };

  messages.push(msg);

  // Push to all connected clients
  io.emit('new_sms', msg);

  res.json({ status: 'received', received: msg });
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log('✅ New frontend connected');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Backend with Socket.IO running on port ${PORT}`);
});
