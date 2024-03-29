const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin:
        // 'http://localhost:3000',
        // 'https://jtkyber.github.io',
        '*',
        methods: ["GET", "POST", "PUT"]
    }
});

// const allowCors = fn => async (req, res) => {
//     res.setHeader('Access-Control-Allow-Credentials', true)
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     // another common pattern
//     // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
//     res.setHeader(
//       'Access-Control-Allow-Headers',
//       'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//     )
//     if (req.method === 'OPTIONS') {
//       res.status(200).end()
//       return
//     }
//     return await fn(req, res)
//   }

io.on('connection', (socket) => {
    socket.on('send shot to opponent', data => {
        socket.broadcast.to(data.socketid).emit('receive shot', data.target);
    })
    
    socket.on('send result to opponent board', data => {
        socket.broadcast.to(data.socketid).emit('show result on opponent board', {result: data.shot, shotSquare: data.shotSquare, shipHit: data.shipHit});
    })
    
    socket.on('update user status', socketId => {
        socket.broadcast.to(socketId).emit('update friend status');
    })
    
    socket.on('send invite', data => {
        socket.broadcast.to(data.socketid).emit('receive invite', {username: data.username, socketid: data.currentSocket});
    })
    
    socket.on('send go to game', data => {
        socket.broadcast.to(data.receiverSocket).emit('receive go to game', {senderSocket: data.senderSocket, senderName: data.senderName});
    })

    socket.on('send friend request', socketid => {
        socket.broadcast.to(socketid).emit('receive friend request');
    })

    socket.on('send ready status', socketid => {
        socket.broadcast.to(socketid).emit('receive ready status');
    })

    socket.on('game over', socketid => {
        socket.broadcast.to(socketid).emit('receive game over');
    })

    socket.on('send exit game', socketid => {
        socket.broadcast.to(socketid).emit('receive exit game');
    })

    socket.on('send msg', data => {
        socket.broadcast.to(data.socketid).emit('receive msg', data.message);
    })
});


server.listen(process.env.PORT || 3001, () => {
    console.log(`listening on port ${process.env.PORT || 3001}`);
});
