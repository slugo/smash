const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const powerRankingSchema = mongoose.Schema({
	date: Date,
    season: String,
    ranking: [ObjectId],
});

module.exports = powerRankingSchema;