import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-division-sorter',
  templateUrl: './division-sorter.component.html',
  styleUrls: ['./division-sorter.component.css']
})
export class DivisionSorterComponent implements OnInit {
  errorObj;
  numTeams;
  numDivs;
  nameDivs;
  displayResults;
  teamInputObj;
  divInputObj;
  displaySubmitButton;
  displayCollectButton;
  displayError;
  displayInitialOptions;
  displayTeamNameInputs;
  displayDivNameInputs;
  displayFinalButtons;
  teamNames;
  divNames;
  secondRowNeeded;
  firstRowResults;
  secondRowResults;
  row1Class;
  row2Class;

  constructor() { 
    this.errorObj = [];
    this.displaySubmitButton = true;
    this.displayInitialOptions = true;
    this.displayResults = false;
    this.displayTeamNameInputs = false;
    this.displayCollectButton = false;
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
    this.displayTeamNameInputs = false;
    this.displayCollectButton = false;
    this.teamInputObj = [];
    this.divInputObj = [];
    this.numTeams = parseInt((<HTMLInputElement>document.getElementById("numTeams")).value, 10);
    this.numDivs = parseInt((<HTMLInputElement>document.getElementById("numDivs")).value, 10);
    this.nameDivs = (<HTMLInputElement>document.getElementById("nameDivs")).checked ? true : false;

    this.checkInitInput();
    if (this.errorObj.length > 0) {
      this.displayError = true;
      return;
    }

    for (var i = 1; i < this.numTeams + 1; i++) {
      this.teamInputObj.push(i);
    }

    if (this.nameDivs) {
      for (var i = 1; i < this.numDivs + 1; i++) {
        this.divInputObj.push(i);
      }
    }

    this.displayTeamNameInputs = true;
    this.displayCollectButton = true;
  }

  checkInitInput(): void {
    if (!Number.isInteger(this.numTeams)) {
      this.errorObj.push("The number of teams entered is not an integer.");
    } else if (!Number.isInteger(this.numDivs)) {
      this.errorObj.push("The number of dvisions entered is not an integer.")
    } else if (this.numTeams > 16 || this.numTeams < 4 || this.numTeams % 2 != 0) {
      this.errorObj.push("The number of teams must be even and between 4 and 16.");
    } else if (this.numTeams % this.numDivs != 0) {
      this.errorObj.push("The number of teams does not evenly divide into the number of divisions.");
    } else if (this.numDivs > 8) {
      this.errorObj.push("The number of teams does not evenly divide into the number of divisions.");
    }
  }

  collectInfo(): void {
    this.resetError();
    this.teamNames = {};
    this.divNames = {};

    for (var i = 1; i < this.teamInputObj.length + 1; i++) {
      var teamName = (<HTMLInputElement>document.getElementById("team" + i)).value;
      if (this.teamNames[teamName] !== undefined) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " is a duplicate name.");
      } else if (teamName.length > 25) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (teamName.length <= 0) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " has an empty name.");
      } else {
        this.teamNames[teamName] = 1;
      }
    }

    for (var i = 1; i < this.divInputObj.length + 1; i++) {
      var divName = (<HTMLInputElement>document.getElementById("div" + i)).value;
      if (this.divNames[divName] !== undefined) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " is a duplicate name.");
      } else if (divName.length > 25) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (divName.length <= 0) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " has an empty name.");
      } else {
        this.divNames[divName] = 1;
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
    this.displayTeamNameInputs = false;
    this.displayDivNameInputs = false;
    this.displayCollectButton = false;
    this.displaySubmitButton = false;
    this.secondRowNeeded = false;

    this.firstRowResults = [];
    var hat = [];
    var divNames = [];
    var teamsPerDiv = this.numTeams / this.numDivs;
    
    for (var team in this.teamNames) {
      hat.push(team);
    }
    this.shuffleArray(hat);

    if (this.nameDivs) {
      for (var div in this.divNames) {
        divNames.push(div);
      }
    } else {
      for (var i = 0; i < this.numDivs; i++) {
        divNames.push("Division " + (i+1));
      }
    }

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

    if (this.numDivs > 4) {
      this.determineColClass(2);
      this.secondRowNeeded = true;
      this.secondRowResults = [];

      // will start at 4 if in this conditional
      for (var i = 4; i < this.numDivs; i++) {
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

    this.displayResults = true;
    this.displayFinalButtons = true;
  }

  reroll(): void {
    this.generateDivisions();
  }

  redo(): void {
    this.displayResults = false;
    this.displayFinalButtons = false;
    this.displayInitialOptions = true;
    this.displaySubmitButton = true;
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
      numDivs = (this.numDivs > 4) ? 4 : this.numDivs;
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
      numDivs = this.numDivs - 4;
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
