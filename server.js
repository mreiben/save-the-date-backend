const express = require('express');
// const models = require('./models');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/db.js');

const app = express();

const MONGO_URI = db.url;
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

app.use(bodyParser.json());

