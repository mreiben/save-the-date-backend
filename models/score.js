const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  name: String,
  value: Number,
  date: Date,
  player: String,
  initials: String,
  mode: String
});

module.exports = mongoose.model('Score', ScoreSchema);