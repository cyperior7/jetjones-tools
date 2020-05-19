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
  teamNames;
  divNames;
  secondRowNeeded;
  firstRowResults;
  secondRowResults;

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
    //TODO: Make these objects (dictionairies) instead and check for uniqueness so no one repeats a name
    this.teamNames = [];
    this.divNames = [];

    for (var i = 1; i < this.teamInputObj.length + 1; i++) {
      var teamName = (<HTMLInputElement>document.getElementById("team" + i)).value;
      if (teamName.length > 25) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (teamName.length <= 0) {
        this.displayError = true;
        this.errorObj.push("Team " + i + " has an empty name.");
      } else {
        this.teamNames.push(teamName);
      }
    }

    for (var i = 1; i < this.divInputObj.length + 1; i++) {
      var divName = (<HTMLInputElement>document.getElementById("div" + i)).value;
      if (divName.length > 25) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " has too long of a name, please keep it under 25 characters.");
      } else if (divName.length <= 0) {
        this.displayError = true;
        this.errorObj.push("Division " + i + " has an empty name.");
      } else {
        this.divNames.push(divName);
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

    this.firstRowResults = [1,2,3];

    if (this.numDivs > 4) {
      this.secondRowNeeded = true;
      this.secondRowResults = [];
    }


    this.displayResults = true;
  }

}
