const request = require('request-promise');
const eventId = 'wii-u-singles';
const players = {};
const matches = [];
const options = {
    rejectUnauthorized: false,
    json: true,
}

function reduceBrackets(tournament){
    return tournament.reduce((prev,curr)=>{
        const oldPlayers = prev.players.map(p=>p.name);
        const newPlayers = curr.players.filter(p=>oldPlayers.indexOf(p.name) === -1);
        return {
            players: prev.players.concat(newPlayers),
            matches: prev.matches.concat(curr.matches),
        }
    },{players:[],matches:[]});
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
        id: player.entrantId,
        name: player.gamerTag,
    }))
}

function formatInfo(tournament){
    return tournament.map(t=>({
        tourneyInfo:getTourneyInfo(t),
        player:t.players,
        matches:t.matches,
    }));
}

function getStandings(tourneyId){
    const TOURNAMENT_URL=`https://api.smash.gg/tournament/${tourneyId}/event/wii-u-singles/standings`;
    return request(TOURNAMENT_URL,options);
}

function formatTourneyInfo(tourneyId, info){
    const TOURNAMENT_URL = `https://api.smash.gg/tournament/${tourneyId}`;
    return request(TOURNAMENT_URL,options)
        .then(res => ({
            tourneyInfo:{
                name: res.entities.tournament.name,
                date: new Date(res.entities.tournament.startAt * 1000),
                participants: info.players.length,
            },
            players: info.players,
            matches: info.matches,
        }))
        .catch(err => console.log(err));
}

function getBrackets(tourneyId){
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

module.exports = (tournamentList) => {
    return new Promise((resolve,reject)=>{
        Promise.all(tournamentList.map(tournamentId=>getBrackets(tournamentId)))
                    .then(res => Promise.all(res.map(brackets=>Promise.all(brackets.map(bracketId=>getBracketMatches(bracketId))))))
                    .then(res => res.map(tournament=>reduceBrackets(tournament)))
                    .then(res => Promise.all(tournamentList.map((tournamentId,idx)=>formatTourneyInfo(tournamentId,res[idx]))))
                    .then(res => resolve(res))
                    .catch(err => console.log(err));
    });
};