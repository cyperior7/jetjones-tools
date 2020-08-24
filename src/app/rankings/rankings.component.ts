import { Component, OnInit } from '@angular/core';
import { Top40Rankings } from './../data/rankings-data';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit {
  top40List = Top40Rankings;

  constructor() { }

  ngOnInit(): void {
  }

}
