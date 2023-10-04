require('dotenv').config()
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

app.use(require('./server/index'));

module.exports = app;