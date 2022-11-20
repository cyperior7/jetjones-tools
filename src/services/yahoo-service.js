const axios = require('axios');
const convert = require('xml-js');

// This is required after the Yahoo resource
const NFL_ID = 'nfl.l';


const ACCESS_TOKEN_HOLDER = { access_token: 'placeholder' };
const getAccessToken = () => {
    return ACCESS_TOKEN_HOLDER.access_token;
}
const setAccessToken = access_token => {
    ACCESS_TOKEN_HOLDER.access_token = access_token;
}

/**
 * @param {*} leagueId 
 * @param {*} teamNumber 
 * @param {*} week 
 * @returns the opponent's team number on the given week
 */
const getOpponentTeamNumber = async (leagueId, teamNumber, week) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${NFL_ID}.${leagueId}/scoreboard?week=${week}`
    const options = {
        url,
        method: 'get',
        headers: { Authorization: `Bearer ${getAccessToken()}` }
    }

    const result = await axios(options);
    const resultJson = JSON.parse(convert.xml2json(result.data, {compact: true, spaces: 4}));
    const allMatchups = resultJson['fantasy_content']['league']['scoreboard']['matchups']['matchup'];

    for (const matchup of allMatchups) {
        const teams = matchup['teams']['team'];
        const teamId1 = teams[0]['team_id']['_text'];
        const teamId2 = teams[1]['team_id']['_text'];
        if (teamId1 === teamNumber) return teamId2;
        if (teamId2 === teamNumber) return teamId1;
    }
    
    throw new Error(`Please make sure requested team number ${teamNumber} is valid`);
}

const getTeamDetailsPerWeek = async (leagueId, teamNumber, week) => {




    try {
        const access_token = req.query.access_token;

        if (!access_token) {
            throw new Error('No Yahoo access code is set');
        }

        const week = req.query.week;
        const leagueId = req.query.leagueId;
        const teamDetails = {}

        const options = {
            url: `https://fantasysports.yahooapis.com/fantasy/v2/team/414.l.915675.t.1/roster;week=10/players`,
            method: 'get',
            headers: { Authorization: `Bearer ${access_token}` }
        }
    
        const result = await axios(options);
        const resultJson = JSON.parse(convert.xml2json(result.data, {compact: true, spaces: 4}));
        const players = resultJson['fantasy_content']['team']['roster']['players']['player'];
        console.log(players);
        for (const player of players) {
            if (player['player_key']) {
                console.log(player['name']);
            }
        }
        //console.log(resultJson['fantasy_content']);

        // make Team API call

        // for each player, make player API call

        // build JSON result

        res.status(200).json({ x: 3 });
    } catch (e) {
        next(e)
    }
}

const compareTeams = (userTeam, oppTeam) => {

}

module.exports = {
    setAccessToken,
    getOpponentTeamNumber,
    getTeamDetailsPerWeek,
    compareTeams,
};