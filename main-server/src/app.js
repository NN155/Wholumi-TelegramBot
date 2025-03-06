require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');
const express = require('express');

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use("/", routes);


app.listen(PORT, () => {
    console.log(`✅ Main Server is running on port ${PORT}`);
});
