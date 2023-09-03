const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors module

const ALLOWED_URL = 'https://brain-swarm.vercel.app'

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ALLOWED_URL
    }
});

// Use cors middleware to allow requests from the React app's domain
app.use(cors({
    origin: ALLOWED_URL,
    methods: ['GET', 'POST'],
}));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', (roomCode) => {
        socket.join(roomCode); // Join the specified room
    });

    socket.on('roll', (diceValue) => {
        const room = Array.from(socket.rooms)[1]; // Get the room code from rooms
        console.log(`Received roll ${diceValue} in room ${room}`);
        io.to(room).emit('roll', diceValue); // Emit to everyone in the room
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
