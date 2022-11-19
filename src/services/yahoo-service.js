const qs = require('qs');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const util = require('node:util');

const CLIENT_SECRET = 'CHANGE ME';

const getAuthToken = async (req, res, next) => {
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
                client_id: 'dj0yJmk9YmJSR2s1MnVWdGNxJmQ9WVdrOVdUSkdOVE5aYm5VbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTM4',
                client_secret: 'CLIENT_SECRET',
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

const getTeamDetailsPerWeek = async (req, res, next) => {
    try {
        const access_token = req.query.access_token;

        if (!access_token) {
            throw new Error('No Yahoo access code is set');
        }

        const week = req.query.week;
        const leagueId = req.query.leagueId;
        const teamDetails = {}

        const options = {
            url: `https://fantasysports.yahooapis.com/fantasy/v2/team/414.l.915675.t.1/roster/players;week=10`,
            method: 'get',
            headers: { Authorization: `Bearer ${access_token}` }
        }
    
        const result = await axios(options);
        const teamJson = parseString(result.data, function (err, result) {
            console.dir(result);
        });
        const newJson = util.inspect(JSON.stringify(teamJson), false, null)
        console.log(newJson.fantasy_content);

        // make Team API call

        // for each player, make player API call

        // build JSON result

        res.status(200).json({ x: 3 });
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getAuthToken,
    getTeamDetailsPerWeek
};