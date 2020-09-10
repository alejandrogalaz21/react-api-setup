// * io.on('connection', function(socket){
// * emit an event to this socket
// * socket.emit('event-name', /* */);
// * emit an event to all connected sockets
// *   io.emit('event-name', /* */);
// * sending a message to everyone else except for the socket that starts it.
// * socket.broadcast.emit('event-name', /* */)
// ! send a message to a specifict socket
// * io.socket.socket(socketId).emit(data.msg)
// * socket.on('event-name', function(){ /* */ }); // listen to the event
