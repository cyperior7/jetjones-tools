import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-division-sorter',
  templateUrl: './division-sorter.component.html',
  styleUrls: ['./division-sorter.component.css']
})
export class DivisionSorterComponent implements OnInit {
  // Display variables
  displayInitialOptions: boolean;
  displayInputBoxesAndGenerate: boolean;
  displayResultsAndFinalButtons: boolean;
  displayError: boolean;

  // Data variables
  errorObj;
  bucket = [];
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

  constructor(
    private cd: ChangeDetectorRef
  ) { 
    this.errorObj = [];
    this.displayInitialOptions = true;
    this.displayInputBoxesAndGenerate = false;
    this.displayResultsAndFinalButtons = false;
    this.displayError = false;
  }

  ngOnInit(): void {
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
      this.handleError();
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
    this.cd.detectChanges();
    document.getElementById("submitInfo").scrollIntoView({behavior: "smooth"});;
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
    } else if (numDivs > 8 || numDivs < 2) {
      this.errorObj.push("The number of divisions must be between 2 and 8.");
    } else if (numTeams % numDivs != 0) {
      this.errorObj.push("The number of teams does not evenly divide into the number of divisions.");
    } 
  }

  resetError(): void {
    this.errorObj = [];
    this.displayError = false;
  }

  handleError(): void {
    this.displayError = true;
    this.cd.detectChanges();
    document.getElementById("errorLocation").scrollIntoView({behavior: "smooth"});
  }

  collectInfo(): void {
    this.resetError();
    this.teamInfo.teamNames = {};
    this.divisionInfo.divNames = {};

    for (var i = 1; i < this.teamInfo.teamInputObj.length + 1; i++) {
      var teamName = (<HTMLInputElement>document.getElementById("team" + i)).value;
      if (this.teamInfo.teamNames[teamName] !== undefined) {
        this.errorObj.push("Team " + i + " is a duplicate name.");
      } else if (teamName.length > 25) {
        this.errorObj.push("Team " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (teamName.length <= 0) {
        this.errorObj.push("Team " + i + " has an empty name.");
      } else {
        this.teamInfo.teamNames[teamName] = 1;
      }
    }

    for (var i = 1; i < this.divisionInfo.divInputObj.length + 1; i++) {
      var divName = (<HTMLInputElement>document.getElementById("div" + i)).value;
      if (this.divisionInfo.divNames[divName] !== undefined) {
        this.errorObj.push("Division " + i + " is a duplicate name.");
      } else if (divName.length > 25) {
        this.errorObj.push("Division " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (divName.length <= 0) {
        this.errorObj.push("Division " + i + " has an empty name.");
      } else {
        this.divisionInfo.divNames[divName] = 1;
      }
    }

    if (this.errorObj.length > 0) {
      this.handleError();
      return;
    }

    this.generateDivisions();
  }

  generateDivisions(): void {
    this.resetError();
    this.displayInitialOptions = false;
    this.displayInputBoxesAndGenerate = false;
    this.bucket = [];

    const numDivs = this.divisionInfo.numDivs;
    const teamsPerDiv = this.teamInfo.numTeams / numDivs;
    const numRows = Math.floor(numDivs / 3);
    let hat = [];
    let divNames = [];
    let result = [];
    let count = 0;
    
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
      result.push({divName: divPicked});
      let teamsPicked = [];
      for (var j = 0; j < teamsPerDiv; j++) {
        teamsPicked.push(hat.pop());
      }
      result[i]["teams"] = teamsPicked;
    }

    // fill rows to be displayed, each row is a bucket that can fit 3 divisions each
    for (let i = 0; i <= numRows; i++) {
      this.bucket.push([]);
      for (let j = 0; j < 3; j++) {
        if (count === result.length) {
          break;
        }
        const resObj = result[count];
        this.bucket[i][j] = resObj;
        count++;
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
}
