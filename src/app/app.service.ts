import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const config = {};

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getToken(code) {
    return(this.http.get(`http://localhost:8080/getAuthToken/${code}`));
  }

  getTeamData() {
    return(this.http.get(`http://localhost:8080/getTeamDetails?access_token=${this.getConfig('access_token')}`));
  }

  setConfig(key, value) {
    config[key] = value;
  }

  getConfig(key) {
    return config[key]; 
  }
}
