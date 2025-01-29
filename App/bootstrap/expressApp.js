const express = require('express');
const cors = require('cors');

const expressApp = express();

// Middleware setup
expressApp.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));
expressApp.use(express.json());

module.exports = expressApp;
