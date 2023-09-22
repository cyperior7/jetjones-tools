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
  yahooCode = '';
  displayYahooSection: boolean;
  leagueId: string;
  leagueName: string;
  weekNumber: string;
  weekSelection: string;
  teamNumber: string;
  errorObj;
  displayError: boolean;
  queryResults: object[];
  percentWonResults: object[];
  displayQueryResults: boolean;
  isLoading: boolean;

  ALL_WEEKS = 'allWeeks';

  constructor(
    private appService: AppService,
    private cd: ChangeDetectorRef
  ) { 
    this.yahooAuthTokenSet = false;
    this.errorObj = [];
    this.displayError = false;
    this.displayQueryResults = false;
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.yahooAuthTokenSet = !!this.appService.getConfig('access_token');
    this.displayYahooSection = !this.yahooAuthTokenSet;
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
      console.log(data['access_token']);
      this.yahooAuthTokenSet = true;
      this.displayYahooSection = false;
      this.cd.detectChanges();
    });
  }

  regenerateYahooAuthToken(): void {
    this.displayYahooSection = true;
    this.yahooAuthTokenSet = false;
    this.appService.setConfig('access_token', '');
  }

  getWeekResults(): void {
    this.setQueryInputs();
    this.validateQueryInput();
    if (this.errorObj.length > 0) {
      this.handleError();
      return;
    }

    this.isLoading = true;

    this.appService.getTeamComparisons(this.leagueId, this.teamNumber, this.weekNumber).subscribe(response => {
      console.log(response['data']);
      this.handleResponse(response);
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

  handleResponse(response): void {
    this.percentWonResults = [];
    if (this.weekNumber === this.ALL_WEEKS) {
      this.setPercentResults(response['data']);
    }
    this.queryResults = response['data'];
    this.displayQueryResults = true;
    this.isLoading = false;
  }

  setPercentResults(data): void {
    const positionIndex = {
      'QB': 0,
      'WR': 1,
      'RB': 2,
      'TE': 3,
      'K': 4,
      'DEF': 5,
      'DEF+K': 6
    };
    // Placeholders
    const numWinsList = [0, 0, 0, 0, 0, 0, 0];

    for (const weekData of data) {
      for (const position of weekData.slice(1)) {
        console.log(position);
        if (position['winner'] === 'user') {
          numWinsList[positionIndex[position['position']]] += 1;
        }
      }
    }

    const result = [];
    for (let i = 0; i < numWinsList.length; i++) {
      const percent = numWinsList[i] / data.length * 100;
      result.push(`${Math.floor(percent)}%`);
    }

    this.percentWonResults = result;
  }

  resubmitQuery(): void {
    this.displayQueryResults = false;
  }

  handleError(): void {
    this.displayError = true;
    this.cd.detectChanges();
    document.getElementById("header").scrollIntoView({ behavior: "smooth" });
  }

  resetError(): void {
    this.errorObj = [];
    this.displayError = false;
  }
}
