require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const express = require('express');
const connectDB = require('./config/mongoDB.js');

connectDB();

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`✅ DB Server is running on port ${PORT}`);
});