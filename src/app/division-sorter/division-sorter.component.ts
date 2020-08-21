import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-division-sorter',
  templateUrl: './division-sorter.component.html',
  styleUrls: ['./division-sorter.component.css']
})
export class DivisionSorterComponent implements OnInit {
  // Display variables
  displayInitialOptions;
  displayInputBoxesAndGenerate;
  displayResultsAndFinalButtons;
  displayError;

  // Data variables
  errorObj;
  teamInfo = {
    numTeams: 0,
    teamNames: {},
    teamInputObj: []
  };
  divisionInfo = {
    numDivs: 0,
    nameDivs: false,
    divInputObj: [],
    divNames: {}
  }
  bucket = [];
  secondRowNeeded;
  firstRowResults;
  secondRowResults;
  row1Class;
  row2Class;

  constructor() { 
    this.errorObj = [];
    this.displayInitialOptions = true;
    this.displayInputBoxesAndGenerate = false;
    this.displayResultsAndFinalButtons = false;
    this.displayError = false;
  }

  ngOnInit(): void {
  }

  resetError(): void {
    this.errorObj = [];
    this.displayError = false;
  }

  submitInfo(): void {
    this.resetError();
    this.displayInputBoxesAndGenerate = false;
    this.teamInfo.teamInputObj = [];
    this.divisionInfo.divInputObj = [];
    this.teamInfo.numTeams = parseInt((<HTMLInputElement>document.getElementById("numTeams")).value, 10);
    this.divisionInfo.numDivs = parseInt((<HTMLInputElement>document.getElementById("numDivs")).value, 10);
    this.divisionInfo.nameDivs = (<HTMLInputElement>document.getElementById("nameDivs")).checked ? true : false;

    this.checkInitInput();
    if (this.errorObj.length > 0) {
      this.displayError = true;
      return;
    }

    for (var i = 1; i < this.teamInfo.numTeams + 1; i++) {
      this.teamInfo.teamInputObj.push(i);
    }

    if (this.divisionInfo.nameDivs === true) {
      for (var i = 0; i < this.divisionInfo.numDivs ; i++) {
        this.divisionInfo.divInputObj.push(i + 1);
      }
    }

    this.displayInputBoxesAndGenerate = true;
  }

  checkInitInput(): void {
    const numTeams = this.teamInfo.numTeams;
    const numDivs = this.divisionInfo.numDivs;
    if (!Number.isInteger(numTeams)) {
      this.errorObj.push("The number of teams entered is not an integer.");
    } else if (!Number.isInteger(numDivs)) {
      this.errorObj.push("The number of dvisions entered is not an integer.")
    } else if (numTeams > 16 || numTeams < 4 || numTeams % 2 != 0) {
      this.errorObj.push("The number of teams must be even and between 4 and 16.");
    } else if (numTeams % numDivs != 0) {
      this.errorObj.push("The number of teams does not evenly divide into the number of divisions.");
    } else if (numDivs > 8) {
      this.errorObj.push("The number of teams does not evenly divide into the number of divisions.");
    }
  }

  collectInfo(): void {
    this.resetError();
    this.teamInfo.teamNames = {};
    this.divisionInfo.divNames = {};

    for (var i = 1; i < this.teamInfo.teamInputObj.length + 1; i++) {
      var teamName = (<HTMLInputElement>document.getElementById("team" + i)).value;
      if (this.teamInfo.teamNames[teamName] !== undefined) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " is a duplicate name.");
      } else if (teamName.length > 25) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (teamName.length <= 0) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " has an empty name.");
      } else {
        this.teamInfo.teamNames[teamName] = 1;
      }
    }

    for (var i = 1; i < this.divisionInfo.divInputObj.length + 1; i++) {
      var divName = (<HTMLInputElement>document.getElementById("div" + i)).value;
      if (this.divisionInfo.divNames[divName] !== undefined) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " is a duplicate name.");
      } else if (divName.length > 25) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (divName.length <= 0) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " has an empty name.");
      } else {
        this.divisionInfo.divNames[divName] = 1;
      }
    }

    if (this.errorObj.length > 0) {
      this.displayError = true;
      return;
    }

    this.generateDivisions();
  }

  generateDivisions(): void {
    this.resetError();
    this.displayInitialOptions = false;
    this.displayInputBoxesAndGenerate = false;
    this.secondRowNeeded = false;

    this.firstRowResults = [];
    const numDivs = this.divisionInfo.numDivs;
    var hat = [];
    var divNames = [];
    var teamsPerDiv = this.teamInfo.numTeams / numDivs;
    let results = [];
    let curInBucket = 0;
    this.bucket = [];

    // [div1, div2, div3, div4]
    // go i -> res length, and place in row i % 3
    // [ [x, y, z], [a, b, c] ]
    // [ [div1, div2, div3], [div4] ]
    
    // create shuffled hat
    for (var team in this.teamInfo.teamNames) {
      hat.push(team);
    }
    this.shuffleArray(hat);

    // create list of division names
    if (this.divisionInfo.nameDivs) {
      for (var div in this.divisionInfo.divNames) {
        divNames.push(div);
      }
    } else {
      for (var i = 0; i < numDivs; i++) {
        divNames.push("Division " + (i+1));
      }
    }

    // sort teams into divisions
    for (var i = 0; i < divNames.length; i++) {
      const divPicked = divNames[i];
      results.push({divName: divPicked});
      let teamsPicked = [];
      for (var j = 0; j < teamsPerDiv; j++) {
        teamsPicked.push(hat.pop());
      }
      results[i]["teams"] = teamsPicked;
    }

    // fill bucket with results in groups of 3 to be displayed
    /*
    let colVal = 0;
    let rowVal = 0;
    while (count < divNames.length) {
      const resObj = results[count];
      if (curInBucket < 3) {
        bucket[rowVal][colVal] = resObj;
        colVal++;
        curInBucket++;
        count++;
      } else {
        curInBucket = 0;
        bucket.push([]);
        rowVal++;
        bucket[rowVal][colVal] = resObj;
        curInBucket++;
        colVal++;
      }
    } */
    console.log(results);
    let count = 0;
    const numRows = Math.floor(numDivs / 3);
    console.log(numRows);
    for (let i = 0; i <= numRows; i++) {
      this.bucket.push([]);
      for (let j = 0; j < 3; j++) {
        if (count === results.length) {
          break;
        }
        const resObj = results[count];
        this.bucket[i][j] = resObj;
        count++;
      }
    }
    console.log(this.bucket);

    this.determineColClass(1);

    var firstPass = (divNames.length > 4) ? 4 : divNames.length;

    for (var i = 0; i < firstPass; i++) {
      var divPicked = divNames[i];
      this.firstRowResults.push({divName: divPicked});
      var teamsPicked = [];
      for (var j = 0; j < teamsPerDiv; j++) {
        teamsPicked.push(hat.pop());
      }
      this.firstRowResults[i]["teams"] = teamsPicked;
    }

    console.log(this.firstRowResults);

    if (numDivs > 4) {
      this.determineColClass(2);
      this.secondRowNeeded = true;
      this.secondRowResults = [];

      // will start at 4 if in this conditional
      for (var i = 4; i < numDivs; i++) {
        var divPicked = divNames[i];
        this.secondRowResults.push({divName: divPicked});
        var teamsPicked = [];
        for (var j = 0; j < teamsPerDiv; j++) {
          teamsPicked.push(hat.pop());
        }
        // need to offset the starting 4 value
        this.secondRowResults[i - 4]["teams"] = teamsPicked;
      }
    }

    this.displayResultsAndFinalButtons = true;
  }

  reroll(): void {
    this.generateDivisions();
  }

  redo(): void {
    this.displayResultsAndFinalButtons = false;
    this.displayInitialOptions = true;
  }

  shuffleArray(array): void {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }

  determineColClass(num): void {
    var numDivs;
    if (num === 1) {
      numDivs = (this.divisionInfo.numDivs > 4) ? 4 : this.divisionInfo.numDivs;
      switch (numDivs) {
        case 1: 
          this.row1Class = "col-md-12"
          break;
        case 2:
          this.row1Class = "col-md-6"
          break;
        case 3:
          this.row1Class = "col-md-4"
          break;
        case 4:
          this.row1Class = "col-md-3"
          break;
      }
    } else {
      numDivs = this.divisionInfo.numDivs - 4;
      switch (numDivs) {
        case 1: 
          this.row2Class = "col-md-12"
          break;
        case 2:
          this.row2Class = "col-md-6"
          break;
        case 3:
          this.row2Class = "col-md-4"
          break;
        case 4:
          this.row2Class = "col-md-3"
          break;
      }
    }
  }

}
