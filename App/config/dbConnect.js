require('dotenv').config();
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;
const log = console.log;

const dbConnect = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        log("Connected to the database");
    }
    catch (error) {
        log("Database Connection error >>> ", error);
        // process.exit(1);
    }
}
module.exports = dbConnect;