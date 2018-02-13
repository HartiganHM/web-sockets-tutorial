var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  let user = `Bob-${Date.now()}`

  console.log('A user connected.');
  socket.broadcast.emit('user connect', `User ${user} has signed on!`);

  socket.on('is typing', (message) => {
    socket.broadcast.emit('other user typing', message)
  })

  socket.on('chat message', function(message) {
    io.emit('chat message', `${user}: ${message}`);
  });

  socket.on('disconnect', () => {
    io.emit('user disconnect', `User ${user} has signed off...`)
    console.log('User disconnected.');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});