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
    'DEF+K': 'DEF+K',
    FLEX: 'W/R/T',
};

const OPP = 'opponent';
const USER = 'user';
const TIE = 'tie';

const logYahooAPICall = url => {
    console.log(`Yahoo API Call: ${url}`);
}

/**
 * @param {*} leagueId 
 * @param {*} teamNumber 
 * @param {*} week 
 * @returns {object} { weekWinnerInfo: {oppScore, userScore, weekWinner}, oppTeamNumber: opponent team number }
 */
const getMatchupInfo = async (leagueId, teamNumber, week) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${NFL_ID}.${leagueId}/scoreboard?week=${week}`;
    logYahooAPICall(url);
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
        const team1Score = teams[0]['team_points']['total']['_text'];
        const team2Score = teams[1]['team_points']['total']['_text'];
        if (teamId1 === teamNumber || teamId2 === teamNumber) {
            const weekWinner = matchup['winner_team_key']
                ? matchup['winner_team_key']['_text'].split('.')[4] === teamNumber ? USER : OPP
                : TIE;
            const isTeam1UserTeam = teamId1 === teamNumber;
            const weekWinnerInfo = {
                oppScore: isTeam1UserTeam ? team2Score : team1Score,
                userScore: isTeam1UserTeam ? team1Score : team2Score,
                weekWinner,
            };
            return {
                oppTeamNumber: isTeam1UserTeam ? teamId2 : teamId1,
                weekWinnerInfo,
            };
        }
    }
    
    throw new Error(`Please make sure requested team number ${teamNumber} is valid`);
}

const getCurrentWeek = async (leagueId) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${NFL_ID}.${leagueId}`;
    logYahooAPICall(url);
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
    logYahooAPICall(url);
    const options = {
        url,
        method: 'get',
        headers: { Authorization: `Bearer ${getAccessToken()}` }
    }
    const result = await axios(options);
    const resultJson = JSON.parse(convert.xml2json(result.data, {compact: true, spaces: 4}));

    const players = resultJson['fantasy_content']['team']['roster']['players']['player'];
    const positionAverages = await calculatePositionAverages(players, leagueId, week);
    return positionAverages;
}

const calculatePositionAverages = async (playerList, leagueId, week) => {
    const positionAverages = {};
    const selectedPositionMapping = {};

    let playerKeyList = '';
    for (const player of playerList) {
        const selectedPosition = player['selected_position']['position']['_text'];
        if (selectedPosition === 'BN' || selectedPosition === 'IR') {
            continue; // skip bench and IR players
        }
        playerKeyList += `${player['player_key']['_text']},`;
        selectedPositionMapping[player['player_key']['_text']] = selectedPosition;
    }
    if (playerKeyList.charAt(playerKeyList.length - 1) === ',') {
        // Remove last comma
        playerKeyList = playerKeyList.slice(0, -1);
    }

    const playerListWithScores = await getPlayersAndScores(leagueId, playerKeyList, week);

    for (const player of playerListWithScores) {
        // If the player is FLEX, use the primary position. If not, use the selected position. If someone like Taysom Hill is FLEX'd, can't do much.
        const position = selectedPositionMapping[player['player_key']['_text']] === POSITIONS.FLEX
            ? player['primary_position']['_text']
            : selectedPositionMapping[player['player_key']['_text']];
        const playerScore = parseFloat(player['player_points']['total']['_text']);
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

const getPlayersAndScores = async (leagueId, playerKeyList, week) => {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${NFL_ID}.${leagueId}/players;player_keys=${playerKeyList}/stats;type=week;week=${week}`;
    logYahooAPICall(url);
    const options = {
        url,
        method: 'get',
        headers: { Authorization: `Bearer ${getAccessToken()}` }
    }
    const result = await axios(options);
    const resultJson = JSON.parse(convert.xml2json(result.data, {compact: true, spaces: 4}));

    return resultJson['fantasy_content']['league']['players']['player'];
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
    getMatchupInfo,
    getTeamDetailsPerWeek,
    compareTeams,
    getCurrentWeek,
};