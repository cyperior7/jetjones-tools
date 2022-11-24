const express = require('express');
const app = express();
const cors = require('cors');
const jetJonesToolsController = require('./src/services/jetjones-tools-service');

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));
app.use(cors());

// Init the server
const server = app.listen(8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get("/getAuthToken/:code", jetJonesToolsController.getAuthToken);
app.get("/getTeamComparisonForWeek", jetJonesToolsController.getTeamComparisonsForWeek);
app.get("/getTeamComparisonAllWeeks", jetJonesToolsController.getTeamComparisonsAllWeeks);

app.get('/', function (req, res) {
  res.send('Hello World')
})