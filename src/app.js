var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var favicon = require('serve-favicon');
var path = require('path');

// This correctly serves all files from your 'public' folder
app.use( '/', express.static(path.join(__dirname, '../public/')) );

io.on('connection', function (socket) {
    socket.on('join', function (data) {
        socket.join(data.roomId);
        socket.room = data.roomId;
        const sockets = io.of('/').in().adapter.rooms.get(data.roomId);

        if(sockets.size === 1){
            socket.emit('init')
        }else{
            if (sockets.size === 2){
                io.to(data.roomId).emit('ready')
            }else{
                socket.room = null
                socket.leave(data.roomId)
                socket.emit('full')
            }

        }
    });
    socket.on('signal', function (data) {
        io.to(data.room).emit('desc', data.desc)
    })
    socket.on('disconnect', function () {
        const roomId = Object.keys(socket.adapter.rooms)[0]
        if (socket.room){
            io.to(socket.room).emit('disconnected')
        }

    })
});

// This uses the correct port for Render
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('listening on *:' + port);
});
