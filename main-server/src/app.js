require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const connectDB = require('./config/mongoDB');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

connectDB();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/", routes);


app.listen(PORT, () => {
    console.log(`✅ Main Server is running on port ${PORT}`);
});
