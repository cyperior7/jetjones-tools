# JetJones Tools

This app provides a suite of tools for Fantasy Football purposes.

Currently, the following tools are available:<br/>
**Division Sorter** - a tool which allows you to sort a specified amount of teams into divisions.<br/>
**Rankings** - a full page of rankings including a top 40 overall, and top 10 lists for QB, D/ST, K, and TE.
**Weekly Stats** - TBD, will contain league information using Yahoo's API

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
