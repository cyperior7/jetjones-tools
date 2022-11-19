const express = require('express');
const app = express();
const cors = require('cors');
const yahooController = require('./src/services/yahoo-service');

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));
app.use(cors());

// Init the server
var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get("/getAuthToken/:code", yahooController.getAuthToken);
app.get("/getTeamDetails", yahooController.getTeamDetailsPerWeek);

app.get('/', function (req, res) {
  res.send('Hello World')
})