# JetJones Tools

[JetJones Tools Website](https://jetjones-tools.web.app/home)


This app provides a suite of tools for Fantasy Football purposes.

Currently, the following tools are available:<br/>
* **Division Sorter**
    * A tool which allows you to sort a specified amount of teams into divisions.<br/>
* **Rankings** 
    * Full page of rankings including a top 40 overall, and top 10 lists for QB, D/ST, K, and TE.
* **Weekly Stats**
    * A tool to calculate a position by position comparison between the user's and opponent's team on a per week basis (all weeks can be requested too).

# Setup

## Weekly Stats
* The Weekly stats page can only be run locally.
* Create a `.env` file and copy the contents from `env.example`. The Client ID and Client Secret need to be populated.
* Update `league-data.ts` file. It assumes I am in 4 leagues. The 4 radio buttons are hard-coded in as of right now. Update the `leagueId` and `teamNumber` per league.

# Running

## Local

* Run the angular application
```
ng serve
```
* Run the NodeJs server (separate terminal)
```
node server.js
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
