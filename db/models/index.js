const playerSchema = require('./player.js');
const matchSchema = require('./match.js');
const tournamentSchema = require('./tournament.js');
const powerRankingSchema = require('./powerRanking.js');

const mongoose = require('mongoose');

module.exports = {
    player: playerSchema,
    match: matchSchema,
    tournament: tournamentSchema,
    powerRanking: powerRankingSchema,
};
