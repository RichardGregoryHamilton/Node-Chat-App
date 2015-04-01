var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var usernames = [];

server.listen(3000);

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    socket.on('New User', function(data, callback) {
        // Check if username is taken
        if (usernames.indexOf(data) != -1) {
            callback(false);
        }
        else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateNames();
        }
    });
    
    // Update the list of active users
    
    function updateNames() {
        io.sockets.emit('usernames', usernames);
    }
    
    socket.on('Send Message', function(data) {
        io.sockets.emit('New Message', {message: data, name: socket.username} );
    });
    
    // Remove users from active users list on disconnect
    socket.on('disconnect', function(data) {
        if (!socket.username) {
            return;
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateNames();
    });
});
