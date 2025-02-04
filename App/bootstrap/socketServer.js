const { Server } = require('socket.io');

const setupSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('playerJoined', (player) => {
            console.log(`Player joined: ${player.name}`);
            io.emit('playerJoined', player);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

module.exports = setupSocketServer;
