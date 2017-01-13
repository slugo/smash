const challonge = require('./challongeParser.js');
const smashgg = require('./smashggParser.js');

module.exports = ({smashggTournaments,challongeTournaments}) => {
    return new Promise((resolve,reject)=>{
        Promise.all([challonge(challongeTournaments),smashgg(smashggTournaments)])
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
    })
}