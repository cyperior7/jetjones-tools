# JetJones Tools

This app provides a suite of tools for Fantasy Football purposes.

Currently, the following tools are available:<br/>
* **Division Sorter**
    * A tool which allows you to sort a specified amount of teams into divisions.<br/>
* **Rankings** 
    * Full page of rankings including a top 40 overall, and top 10 lists for QB, D/ST, K, and TE.
* **Weekly Stats**
    * TBD, will contain league information using Yahoo's API

    Roster per week per team: `https://fantasysports.yahooapis.com/fantasy/v2/team/414.l.915675.t.1/roster/players;week=10`
    Player per specific week: `https://fantasysports.yahooapis.com/fantasy/v2/league/414.l.915675/players;player_keys=414.p.33394/stats;type=week;week=10`

| Role      | QB | Ignore|
| ----------- | ----------- | ---|
| X | Justin | Josh |
| 1      | 45  (color code)     | 50 |
| 2   | 32        | 37 |

# Running

## Development

* Run the server
```
ng serve
```
* Navigate to the local URL
```
http://localhost:4200/
```

## Production

* Create a production build at `dist/jetjones-tools`
```
ng build --aot --configuration "production"
```
* Login to Firebase
```
firebase login --interactive
```
* Deploy to Firebase
```
firebase deploy --only hosting
```
* Navigate to the URL
```
https://jetjones-tools.web.app/home
```
