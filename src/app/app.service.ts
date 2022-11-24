import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const config = {};
const LOCAL_HOST = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getToken(code) {
    return(this.http.get(`${LOCAL_HOST}/getAuthToken/${code}`));
  }

  getTeamComparisons(leagueId, teamNumber, week) {
    const url = `${LOCAL_HOST}/getTeamComparisons?access_token=${this.getConfig('access_token')}&leagueId=${leagueId}&teamNumber=${teamNumber}&week=${week}`;
    return(this.http.get(url));
  }

  setConfig(key, value) {
    config[key] = value;
  }

  getConfig(key) {
    return config[key]; 
  }
}
