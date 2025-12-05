const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomRoutes = require('./routes/rooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this demo
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/rooms', roomRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        // Optionally notify others in room
    });

    socket.on('code-change', ({ roomId, code }) => {
        // Broadcast to everyone else in the room
        socket.to(roomId).emit('code-update', code);
    });

    // Handle language change sync
    socket.on('language-change', ({ roomId, language }) => {
        socket.to(roomId).emit('language-update', language);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
