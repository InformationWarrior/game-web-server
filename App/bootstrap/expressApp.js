const express = require('express');
const cors = require('cors');

const expressApp = express();

const corsOptions = {
    origin: '*', // Allow all origins (change to specific domain in production)
    credentials: true,
    methods: ['GET', 'POST']
  };

expressApp.use(cors(corsOptions));
expressApp.use(express.json());

module.exports = expressApp;
