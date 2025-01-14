const express = require('express');
const app = express();
const laserBlastRouter = require('./Games/LaserBlast/routes/LaserBlast.routes');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api/laser-blast', laserBlastRouter);



module.exports = app;