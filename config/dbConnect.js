require('dotenv').config(); // Load environment variables from .env
const DB_URL = process.env.DB_URL;
const mongoose = require('mongoose');
const dbConnect = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to the database");
    } catch (error) {
        console.error("Database Connection error >>> ", error);
    }
};
module.exports = dbConnect;
