import { Component, OnInit } from '@angular/core';
import { Top40Rankings, Top10Quarterbacks, Top10TightEnds, Top10Defenses, Top10Kickers } from './../data/rankings-data';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit {
  top40List = Top40Rankings;
  top10QBs = Top10Quarterbacks;
  top10TEs = Top10TightEnds
  top10Defs = Top10Defenses;
  top10Ks = Top10Kickers;

  constructor() { }

  ngOnInit(): void {
  }

}
