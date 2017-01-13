const challonge = require('./challongeParser.js');
const smashgg = require('./smashggParser.js');

module.exports = ({smashggTournaments,challongeTournaments}) => {
    return new Promise((resolve,reject)=>{
        Promise.all([challonge(challongeTournaments),smashgg(smashggTournaments)])
        .then(res=>resolve(res.reduce((prev,curr)=>prev.concat(curr),[])))
        .catch(err=>console.log(err));
    })
}