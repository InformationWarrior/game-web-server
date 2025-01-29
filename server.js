require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const expressApp = require('./App/bootstrap/expressApp');
const dbConnect = require('./App/config/dbConnect');
const apolloServer = require('./App/bootstrap/apolloServer');

const PORT = process.env.PORT || 5000;

// Create an HTTP server
const server = http.createServer(expressApp);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Start the server
(async () => {
    try {
        // Connect to the database
        await dbConnect();

        // Set up Apollo Server
        await apolloServer.start();
        apolloServer.applyMiddleware({ app: expressApp });

        console.log(`GraphQL API is available at http://localhost:${PORT}${apolloServer.graphqlPath}`);

        // Handle Socket.io connections
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

        // Start the HTTP server
        server.listen(PORT, () => {
            console.log(`Server is up and running at http://localhost:${PORT}...`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
})();
