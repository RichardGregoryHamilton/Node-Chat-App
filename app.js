var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function(request, response) {
		response.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
		socket.on('send message', function(data) {
				io.sockets.emit('New Message', data);
		});
});