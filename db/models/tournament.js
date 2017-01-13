const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const tournamentSchema = mongoose.Schema({
	name: String,
    date: Date,
    participants: Number,
    placings: [ObjectId]
});

module.exports = tournamentSchema;