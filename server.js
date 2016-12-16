const bodyParser = require('koa-body');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const router = require('./api/routes/index');
const app = require('koa')();

require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

app.use(logger());
app.use(bodyParser());
app.use(router);

const server = require('http').createServer(app.callback());

server.listen(3001);
