require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const express = require('express');
const bot = require('./bot/telegramBot');

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`✅ Telegram Server is running on port ${PORT}`);
});