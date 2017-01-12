const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
	name: String,
    characters: [String],
});

module.exports = playerSchema;