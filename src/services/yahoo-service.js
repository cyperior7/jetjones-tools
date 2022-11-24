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

const POSITIONS = {
    QB: 'QB',
    WR: 'WR',
    RB: 'RB',
    TE: 'TE',
    K: 'K',
    DEF: 'DEF',
    'DEF+K': 'DEF+K'
};

const OPP = 'opponent';
const USER = 'user';
const TIE = 'tie';

/**
 * @param {*} leagueId 
 * @param {*} teamNumber 
 * @param {*} week 
 * @returns {object} { weekWinner: user/opponent, oppTeamNumber: opponent team number }
 */
const getOpponentTeamNumberAndWeekWinner = async (leagueId, teamNumber, week) => {
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
        if (teamId1 === teamNumber) {
            const weekWinner = matchup['winner_team_key']
                ? matchup['winner_team_key']['_text'].split('.')[4] === teamNumber ? USER : OPP
                : TIE;
            return {
                oppTeamNumber: teamId2,
                weekWinner
            };
        } else if (teamId2 === teamNumber) {
            const weekWinner = matchup['winner_team_key']
                ? matchup['winner_team_key']['_text'].split('.')[4] === teamNumber ? USER : OPP
                : TIE;
            return {
                oppTeamNumber: teamId1,
                weekWinner
            };
        }
    }
    
    throw new Error(`Please make sure requested team number ${teamNumber} is valid`);
}

const getCurrentWeek = async (leagueId) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${NFL_ID}.${leagueId}`;
    const options = {
        url,
        method: 'get',
        headers: { Authorization: `Bearer ${getAccessToken()}` }
    }
    const result = await axios(options);
    const resultJson = JSON.parse(convert.xml2json(result.data, {compact: true, spaces: 4}));

    const currentWeek = parseInt(resultJson['fantasy_content']['league']['current_week']['_text']);
    return currentWeek;
}

const getTeamDetailsPerWeek = async (leagueId, teamNumber, week) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${NFL_ID}.${leagueId}.t.${teamNumber}/roster;week=${week}/players`;
    const options = {
        url,
        method: 'get',
        headers: { Authorization: `Bearer ${getAccessToken()}` }
    }
    const result = await axios(options);
    const resultJson = JSON.parse(convert.xml2json(result.data, {compact: true, spaces: 4}));

    const players = resultJson['fantasy_content']['team']['roster']['players']['player'];
    const positionAverages = await calculatePositionAverages(players, leagueId);
    return positionAverages;
}

const calculatePositionAverages = async (playerList, leagueId) => {
    const positionAverages = {};

    for (const player of playerList) {
        const startingStatus = player['selected_position']['position']['_text'];
        if (startingStatus === 'BN' || startingStatus === 'IR') {
            continue; // skip bench and IR players
        }
        const position = player['primary_position']['_text'];
        const week = player['selected_position']['week']['_text'];
        const playerScore = await getPlayerScorePerWeek(leagueId, player['player_key']['_text'], week);

        if (positionAverages[position]) {
            positionAverages[position].score += playerScore;
            positionAverages[position].count += 1;
        } else {
            positionAverages[position] = {
                score: playerScore,
                count: 1
            };
        }
    }

    for (const position in positionAverages) {
        positionAverages[position] = positionAverages[position].score / positionAverages[position].count;
    }

    positionAverages[POSITIONS['DEF+K']] = positionAverages[POSITIONS.K] + positionAverages[POSITIONS.DEF];

    return positionAverages;
}

const getPlayerScorePerWeek = async (leagueId, playerId, week) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${NFL_ID}.${leagueId}/players;player_keys=${playerId}/stats;type=week;week=${week}`;
    const options = {
        url,
        method: 'get',
        headers: { Authorization: `Bearer ${getAccessToken()}` }
    }
    const result = await axios(options);
    const resultJson = JSON.parse(convert.xml2json(result.data, {compact: true, spaces: 4}));

    const playerScore = parseFloat(resultJson['fantasy_content']['league']['players']['player']['player_points']['total']['_text']);
    return playerScore;
}

const compareTeams = (userTeam, oppTeam) => {
    const result = [];
    const positionOrder = [POSITIONS.QB, POSITIONS.WR, POSITIONS.RB, POSITIONS.TE, POSITIONS.K, POSITIONS.DEF, POSITIONS['DEF+K']];

    for (const position of positionOrder) {
        const userValue = userTeam[position];
        const oppValue = oppTeam[position];
        const obj = {
            position,
            userScore: userValue.toFixed(2),
            oppScore: oppValue.toFixed(2),
            winner: userValue > oppValue
                ? USER
                : oppValue > userValue
                    ? OPP
                    : TIE
        };
        result.push(obj);
    }

    return result;
}

module.exports = {
    setAccessToken,
    getOpponentTeamNumberAndWeekWinner,
    getTeamDetailsPerWeek,
    compareTeams,
    getCurrentWeek,
};