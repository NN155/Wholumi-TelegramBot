require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `${process.env.TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}`;
const EXTENSION_URL = process.env.EXTENSION_URL;

const corsOptions = {
    origin: 'https://animestars.org',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://animestars.org');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    next();
});

app.use("/", routes);

async function setWebhook() {
    try {
        const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url: `${EXTENSION_URL}/webhook`
            })
        });

        const data = await response.json();
        console.log("📌 Webhook установлен:", data);
    } catch (error) {
        console.error("❌ Ошибка установки webhook:", error);
    }
}
setWebhook();


app.listen(3000, () => {
    console.log('✅ Server is running on port 3000');
    console.log('📡 Если используете ngrok, запустите: ngrok http 3000 --host-header="localhost:3000"');
});
