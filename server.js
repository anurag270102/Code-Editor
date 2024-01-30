const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const ACTIONS = require('./src/action');



const io = new Server(server);


const userSocketMap = {};

function getallconnectedclient(roomId) {
    //get return map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        .map((socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            }
        });
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getallconnectedclient(roomId);
        console.log(clients);
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`listing on ${PORT}`) })