const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const matchSchema = mongoose.Schema({
	player1: ObjectId,
    player2: ObjectId,
    tournament: ObjectId,
    score: String,
    round: String,
});

module.exports = matchSchema;