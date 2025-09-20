import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});
const ROOM = 'group-chat';

io.on('connection', (socket) => {
    // console.log('a user connected', socket.id);

    socket.on("joinRoom", async (userName) => {
        await socket.join(ROOM);

        // if a new user joins, notify everyone in the room
        // io.to(ROOM).emit("newuserjoined", userName);

        // notify everyone except the new user that just joined
        socket.to(ROOM).emit("newuserjoined", userName);
    });

    socket.on("chatMessage", (msg) => {
        socket.to(ROOM).emit("chatMessage", msg);
    });

    socket.on("typing", (userName) => {
        socket.to(ROOM).emit("typing", userName);
    });

    socket.on("stopTyping", (userName) => {
        socket.to(ROOM).emit("stopTyping", userName);
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

server.listen(5500, () => {
    console.log('server running at http://localhost:5500');
});