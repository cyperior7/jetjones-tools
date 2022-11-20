import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../app.service';
import { leagueInformation } from '../data/league-data';

@Component({
  selector: 'app-weekly-stats',
  templateUrl: './weekly-stats.component.html',
  styleUrls: ['./weekly-stats.component.css']
})
export class WeeklyStatsComponent implements OnInit {

  yahooAuthTokenSet: boolean;
  leagueId: string;
  leagueName: string;
  weekNumber: string;
  weekSelection: string;
  teamNumber: string;
  errorObj;
  displayError: boolean;

  ALL_WEEKS = 'allWeeks';

  constructor(
    private appService: AppService,
    private cd: ChangeDetectorRef
  ) { 
    this.yahooAuthTokenSet = false;
    this.errorObj = [];
    this.displayError = false;
  }

  ngOnInit(): void {
    this.yahooAuthTokenSet = !!this.appService.getConfig('access_token');
  }

  getYahooToken(): void {
    const code = (<HTMLInputElement>document.getElementById("yahooCode")).value;

    if (!code) {
      this.resetError();
      this.errorObj.push("Please provide a Yahoo code before attempting to generate a Yahoo auth token.");
      this.handleError();
      return;
    }

    this.appService.getToken(code).subscribe(data => {
      this.appService.setConfig('access_token', data['access_token']);
      this.yahooAuthTokenSet = true;
    });
  }

  getWeekResults(): void {
    this.setQueryInputs();
    this.validateQueryInput();
    if (this.errorObj.length > 0) {
      this.handleError();
      return;
    }

    // '915675', '1', '7'
    // TODO: Take this data and display it somehow on the front end
    // TODO: Handle the "All Weeks" option
    //       - need to figure out the current week so you have a range
    this.appService.getTeamComparisonPerWeek(this.leagueId, this.teamNumber, this.weekNumber).subscribe(data => {
      console.log(data);
    });
  }

  setQueryInputs(): void {
    if (this.leagueName === 'customLeague') {
      this.leagueId = (<HTMLInputElement>document.getElementById("customLeagueId")).value;
    } else if (this.leagueName) {
      this.leagueId = leagueInformation[this.leagueName]?.leagueId;
      this.teamNumber = leagueInformation[this.leagueName]?.teamNumber;
    }

    if (this.weekSelection === 'customWeek') {
      this.weekNumber = (<HTMLInputElement>document.getElementById("customWeekNumber")).value;
    } else {
      this.weekNumber = this.ALL_WEEKS;
    }
  }

  validateQueryInput(): void {
    this.resetError();
    if (!this.yahooAuthTokenSet) {
      this.errorObj.push("A Yahoo Auth token needs to be set, please follow the Yahoo Auth Token workflow below.");
    } else if (!this.leagueId) {
      this.errorObj.push("Please make sure to select a league or enter a custom league id.");
    } else if (!this.teamNumber) {
      this.errorObj.push("Please make sure to enter a team number if selecting a custom league id.");
    } else if (!this.weekNumber) {
      this.errorObj.push("Please make sure to enter a week number or select 'All Weeks'.");
    }
  }

  handleError(): void {
    this.displayError = true;
    this.cd.detectChanges();
    document.getElementById("header").scrollIntoView({ behavior: "smooth"});
  }

  resetError(): void {
    this.errorObj = [];
    this.displayError = false;
  }
}
