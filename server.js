'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
	.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
	.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
	console.log('Client connected');

	socket.on('send_votes', function (votes) {
		socket.broadcast.emit('votes', votes)
	})
	
	socket.on('new_user', function (user) {
		socket.broadcast.emit('new_user_arrived', user)
	})
	
	socket.on('update_users', function (users) {
		io.emit('users_updated', users)
	})

	socket.on('disconnect', (user) => {
		io.emit('disconnected', user)
	})
	
	socket.on('reset_cards', () => {
		io.emit('restart')
	})
	
	socket.on('reveal_card', () => {
		io.emit('card_revealed')
	})
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
