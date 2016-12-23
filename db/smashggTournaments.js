const request = require('request-promise');
const players = {};
const matches = [];
const options = {
    rejectUnauthorized: false,
    json: true,
}

function getMatches(matches){
    return matches.map(match=>({
        player1:match.entrant1Id,
        player2:match.entrant2Id,
        score: `${match.entrant1Score} - ${match.entrant2Score}`,
        round: match.round,
        roundName: match.midRoundText,
    }))
}

function getPlayers(players){
    return players.map(player=>({
        id: player.id,
        name: player.gamerTag,
    }))
}

function getBrackets(tourneyId, eventId){
    const TOURNAMENT_URL = `https://api.smash.gg/tournament/${tourneyId}/event/${eventId}?expand[]=groups`;
    return request(TOURNAMENT_URL,options)
        .then(res => res.entities.groups.map(g=>g.id))
        .catch(err => console.log(err));
}

function getBracketMatches(bracketId){
    const BRACKET_URL = `https://api.smash.gg/phase_group/${bracketId}?expand%5B%5D=entrants&expand[]=sets`;
    return request(BRACKET_URL,options)
        .then(res =>({
                players: getPlayers(res.entities.player),
                matches: getMatches(res.entities.sets),
            })
        )
        .catch(err => console.log(err));
}

const bracketsIds = getBrackets("fighting-fest-2016","wii-u-singles")
                    .then(res => Promise.all(res.map(id=>getBracketMatches(id))))
                    .then(res => console.log(res))
                    .catch(err => console.log(err));