const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const ACTIONS = require('./src/action');
// var path = require('path');
var bodyparser = require('body-parser');
var complier = require('compilex');

const io = new Server(server);
app.use(bodyparser());
var options = { stats: true };
complier.init(options);

app.get('/editor/:roomId',(req,res)=>{
    console.log(req);
    console.log(res);
})
app.post('/editor/:roomId',(req,res)=>{
    console.log(req);
    console.log(res);
})
const userSocketMap = {};

function getsallconnectedclients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            console.log(userSocketMap);
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', async (socket) => {
    console.log('socket connected', socket.id);
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getsallconnectedclients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        // console.log(code);
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        // console.log(code);
        io.to(socketId).emit(ACTIONS.SYNC_CODE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`listing on ${PORT}`) })