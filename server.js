require('dotenv').config();
const app = require('./app');
const log = console.log;
const PORT = process.env.PORT;

app.listen(PORT, (error) => {
    if (!error)
        log(`Server is up and running at http://localhost:${PORT}...`);
    else
        log("Error occurred, server can't start. ", error);
});