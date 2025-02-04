require('dotenv').config();
const http = require('http');
const dbConnect = require('./App/config/dbConnect');
const expressApp = require('./App/bootstrap/expressApp');
const apolloServer = require('./App/bootstrap/apolloServer');
const setupSocketServer = require('./App/bootstrap/socketServer');
const startBackgroundTasks = require("./App/GraphQL/WheelSpin/backgroundTasks")

const PORT = process.env.PORT || 5000;

// Create an HTTP server
const server = http.createServer(expressApp);

// Initialize Socket.io
// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ['GET', 'POST'],
//     },
// });

// Start the server
(async () => {
    try {
        // Connect to the database
        await dbConnect();

        // Set up Apollo Server
        await apolloServer.start();
        apolloServer.applyMiddleware({ app: expressApp });

        console.log(`GraphQL API is available at http://localhost:${PORT}${apolloServer.graphqlPath}`);

        // Initialize WebSocket server
        setupSocketServer(server);

        // Start the HTTP server
        server.listen(PORT, () => {
            console.log(`Server is up and running at http://localhost:${PORT}...`);
            startBackgroundTasks();
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
})();
