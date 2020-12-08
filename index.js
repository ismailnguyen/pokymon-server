const express = require('express')
const app = express()

const server = app.listen(3001, function () {
	console.log('server is listening on port 3001')
})

const io = require('socket.io')(server)

io.on('connection', function (socket) {
	console.log('a user is connected', socket.id)
	
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
})