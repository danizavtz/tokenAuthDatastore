require('dotenv').config()
const express = require('express');
const cors = require('cors');
const expressJwt = require('express-jwt');

const app = express();
app.use('/secure', expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] }));
cors({ credentials: true, origin: true });
app.use(cors());
app.use(express.json());

app.use(require('./server/index'));

module.exports = app;