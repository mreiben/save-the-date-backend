const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');
const db = require('./config/db.js');
const Score = require('./models/score');

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =================================
let router = express.Router();

// routes that end in /scores
router.route('/scores')

  .post(function(req, res) {
    let score = new Score();
    score.name = req.body.name;
    score.value = req.body.value;
    score.date = moment().format('YYYY-MM-DD HH:mm');
    score.player = req.body.player;

    // save the score and check for errors
    score.save(function(err) {
      if (err)
          res.send(err);

      res.json({
        message: 'Score created!',
        score: score
      });
    });
  })

  .get(function(req, res) {
    Score.find(function(err, scores) {
      if (err) res.send(err);
      
      res.json(scores);
    });
  });

// route for requesting individual score
router.route('/scores/:score_id')

  // get the socre with that id (accessed at GET http://localhost:8080/api/scores/:score_id)
  .get(function(req, res) {
    Score.findById(req.params.score_id, function(err, score) {
      if (err) res.send(err);
      res.json(score);
    });
  });

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
  res.json({ message: 'yay! welcome to our api!' });
});

// more routes will go here


// REGISTER THE ROUTES ------------------------------------
// all routes will be prefixed with /api

app.use('/api', router);

// START THE SERVER
// =================================
app.listen(port);
console.log('Listening on port ' + port);