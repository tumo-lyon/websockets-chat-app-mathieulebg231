
import {createServer} from 'node:http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';

const app = express(); // <-- Création d'une application Express
const server = createServer(app); // <-- Utilisation de l'application Express
const io = new SocketServer(server); // <-- Création d'un serveur WebSocket

// Configuration de l'application Express
app.use(express.static('public')); // <-- Serveur de fichiers statiques

app.get('/', (req, res) => {
	res.redirect('/index.html'); // <-- Redirection vers la page d'accueil
});

server.listen(3000, () => { // <-- Démarrage du serveur
	console.log('Server is running on port 3000');
});

// Exemple de serveur Express avec un serveur HTTP


//////////////////////////////

const typingUsers = new Set()

io.on('connection', (socket) => {
	console.log(`Someone connected: ${socket.conn.remoteAddress.replace('::ffff:', '')}`);

    io.emit('system_message', {content : `Welcome to ${socket.conn.remoteAddress.replace('::ffff:', '')}!`})
    io.emit('system_message', {
        content : `Goodbye ${socket.conn.remoteAddress.replace('::ffff:', '')} :'(`
    })
    socket.on('typing_start', () => {
        typingUsers.add(socket.conn.remoteAddress.replace('::ffff:', ''))
        console.log(typingUsers)
        io.emit('typing', Array.from(typingUsers))
    })
    socket.on('typing_stop', () => {
        typingUsers.delete(socket.conn.remoteAddress.replace('::ffff:', ''))
        io.emit('typing', Array.from(typingUsers))
    })

    socket.on('user_message_send', (data) => {
        console.log(`${socket.conn.remoteAddress.replace('::ffff:', '')}, Message: ${data.content}`)

        io.emit('user_message', {
            author : socket.conn.remoteAddress.replace('::ffff:', ''),
            content : data.content,
            time :  new Date().toLocaleTimeString(),
            isMe : false,
        })
    })

	socket.on('disconnect', () => {
		console.log(`User ${socket.conn.remoteAddress.replace('::ffff:', '')} disconnected`);
	});
});