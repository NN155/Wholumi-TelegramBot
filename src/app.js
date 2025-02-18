require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const express = require('express');
const bodyParser = require('body-parser');
const setWebhook = require('./telegram/setWebHook');

setWebhook();

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/", routes);



app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
