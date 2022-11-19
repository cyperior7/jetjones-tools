import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-weekly-stats',
  templateUrl: './weekly-stats.component.html',
  styleUrls: ['./weekly-stats.component.css']
})
export class WeeklyStatsComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit(): void {
  }

  getYahooToken() {
    const code = (<HTMLInputElement>document.getElementById("yahooCode")).value;
    console.log('test');
    this.appService.getToken(code).subscribe(data => {
      console.log(data);
      this.appService.setConfig('access_token', data['access_token'])
    });
  }

  getTeamData() {
    this.appService.getTeamData().subscribe(data => {
      console.log(data);
    });
  }

}
