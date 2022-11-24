require('dotenv').config();
const qs = require('qs');
const axios = require('axios');
const yahooService = require('./yahoo-service');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET; 

/**
 * Gets the auth token from Yahoo using a client id, client secret, and yahoo code
 * Path parameters:
 * @param code - the code given by Yahoo as a security measure
 */
 const getAuthToken = async (req, res, next) => {
    console.log(`[${new Date()}] Request to /getAuthToken`);
    try {
        const code = req.params.code;

        if (!code) {
            throw new Error('No Yahoo code sent');
        }

        const options = {
            url: `https://api.login.yahoo.com/oauth2/get_token`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: 'oob',
                code,
                grant_type: 'authorization_code'
            })
        }
    
        const result = await axios(options);
        const access_token = result.data.access_token;
        res.status(200).json({ access_token });
    } catch (e) {
        next(e)
    }
}

/**
 * Returns an array of positional comparisons between two teams on a given week
 * Query parameters:
 * @param access_token - access token generated from "getAuthToken"
 * @param teamNumber - user's team number
 * @param leagueId - the league id
 * @param week - the target week - could be "allWeeks"
 */
const getTeamComparisons = async (req, res, next) => {
    console.log(`[${new Date()}] Request to /getTeamComparisons`);
    try {
        const access_token = req.query.access_token;
        const teamNumber =  req.query.teamNumber;
        const leagueId = req.query.leagueId; 
        const week = req.query.week;

        if (!access_token) {
            throw new Error('No access_token passed in the query parameters.')
        } else if (!teamNumber || !leagueId || !week) {
            throw new Error(`Missing team number, week, or league id in the query parameters.`);
        }

        yahooService.setAccessToken(access_token);

        const result = [];

        if (week === 'allWeeks') {
            const currentWeek = await yahooService.getCurrentWeek(leagueId);
            for (let week = 1; week <= currentWeek; week++) {
                console.log(`Fetching week ${week}`);
                const teamComparison = await getTeamComparisonsResult(leagueId, teamNumber, week);
                result.push(teamComparison);
            }
        } else {
            const teamComparison = await getTeamComparisonsResult(leagueId, teamNumber, week);
            result.push(teamComparison);
        }

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e)
    }
}

const getTeamComparisonsResult = async (leagueId, teamNumber, week) => {
    const { weekWinnerInfo, oppTeamNumber } = await yahooService.getMatchupInfo(leagueId, teamNumber, week);
    const userTeamInfo = await yahooService.getTeamDetailsPerWeek(leagueId, teamNumber, week);
    const opponentTeamInfo = await yahooService.getTeamDetailsPerWeek(leagueId, oppTeamNumber, week);
    const teamComparison = yahooService.compareTeams(userTeamInfo, opponentTeamInfo);
    teamComparison.unshift(weekWinnerInfo);
    return teamComparison;
}

module.exports = {
    getAuthToken,
    getTeamComparisons,
};