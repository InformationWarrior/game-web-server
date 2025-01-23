const express = require('express');
const app = express();
const pachinkoRouter = require('./App/Games/Pachinko/routes/Pachinko.routes');
const wheelSpinRouter = require("./App/Games/WheelSpin/routes/wheelSpin.routes");
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api/pachinko', pachinkoRouter);
app.use('/api/wheelSpin', wheelSpinRouter);


module.exports = app;