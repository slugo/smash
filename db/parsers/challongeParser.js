const request = require('request-promise');
const BASE_URL = "http://api.challonge.com/v1/tournaments/";

require('dotenv').config();

const options = {
    qs: {
        api_key: process.env.CHALLONGE_KEY,
        include_participants: 1,
        include_matches: 1,
    },
    rejectUnauthorized: false,
    json: true,
}

function getPlayers(tournament){
    return tournament.participants.map(({participant})=>({
           id: participant.id,
           player: participant.name,
           rank: participant.final_rank,
    }))
}
function getMatches(tournament){
    return tournament.matches.map(({match})=>({
           player1: match.player1_id,
           player2: match.player2_id,
           score: match.scores_csv,
    }))
}
function getTourneyInfo(tournament){
    let {name, started_at, participants_count} = tournament;
    return {
        name,
        date: started_at,
        participants:participants_count
    }
}
function getTournament(tournamentId){
    return request(Object.assign({},options,{uri:`${BASE_URL}/${tournamentId}.json`}))
           .then(({tournament})=>{
                return {
                    tourneyInfo:getTourneyInfo(tournament),
                    players:getPlayers(tournament),
                    matches:getMatches(tournament),
                }
            })
            .catch((err)=>console.log(err));
}

module.exports = (tournamentList) => {
    return new Promise((resolve,reject)=>{
        Promise.all(tournamentList.map((id)=>getTournament(id)))
            .then(res => resolve(res))
            .catch(err => console.log(err));
    })
}