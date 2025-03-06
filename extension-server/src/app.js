require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const SocketManager = require('./socket/SocketManager');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use("/", routes);

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
});

SocketManager.setIo(io);

io.on('connection', (socket) => {
    SocketManager.handleConnection(socket);
});


server.listen(PORT, () => {
    console.log(`✅ Extension Server is running on port ${PORT}`);
});
