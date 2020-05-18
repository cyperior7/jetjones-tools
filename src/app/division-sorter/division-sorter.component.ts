import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-division-sorter',
  templateUrl: './division-sorter.component.html',
  styleUrls: ['./division-sorter.component.css']
})
export class DivisionSorterComponent implements OnInit {
  error;
  numTeams;
  numDivs;
  nameDivs;
  displayInitialOptions;
  displayTeamNameInputs;
  displayDivNameInputs;
  displayResults;
  teamInputObj;
  displayCollectButton;

  constructor() { 
    this.error = [];
    this.displayResults = false;
    this.displayTeamNameInputs = false;
    this.displayCollectButton = false;
  }

  ngOnInit(): void {
  }

  resetError(): void {
    this.error = [];
  }

  submitInfo(): void {
    this.resetError();
    this.displayTeamNameInputs = false;
    this.teamInputObj = [];
    this.numTeams = parseInt((<HTMLInputElement>document.getElementById("numTeams")).value, 10);
    this.numDivs = parseInt((<HTMLInputElement>document.getElementById("numDivs")).value, 10);
    this.nameDivs = (<HTMLInputElement>document.getElementById("nameDivs")).checked ? true : false;

    if (!Number.isInteger(this.numTeams)) {
      this.error.push("The number of teams entered is not an integer.");
      return;
    }
    if (!Number.isInteger(this.numDivs)) {
      this.error.push("The number of dvisions entered is not an integer.")
      return;
    }
    if (this.numTeams > 16 || this.numTeams < 4 || this.numTeams % 2 != 0) {
      this.error.push("The number of teams must be even and between 4 and 16.");
      return;
    }
    if (this.numTeams % this.numDivs != 0) {
      this.error.push("The number of teams does not evenly divide into the number of divisions.");
      return;
    }

    for (var i = 0; i < this.numTeams; i++) {
      this.teamInputObj.push(i+1);
    }
    this.displayTeamNameInputs = true;
    this.displayCollectButton = true;
  }

  collectInfo(): void {
    console.log("Good!");
  }

}
