const express = require('express');
const cors = require('cors');

const expressApp = express();

// Middleware setup
expressApp.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));
expressApp.use(express.json());

// Example route (you can include others)
const pachinkoRouter = require('../App-unfocus/Games/Pachinko/routes/Pachinko.routes');
expressApp.use('/api/pachinko', pachinkoRouter);

module.exports = expressApp;
