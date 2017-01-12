const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const tournamentSchema = mongoose.Schema({
	name: String,
    date: Date,
    particinpants: Integer,
    placings: [ObjectId]
});

module.exports = tournamentSchema;