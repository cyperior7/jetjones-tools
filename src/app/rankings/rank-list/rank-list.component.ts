import { Component, OnInit, Input } from '@angular/core';
import { RankItem } from './../../models/rank-list-model';

@Component({
  selector: 'rank-list',
  templateUrl: './rank-list.component.html',
  styleUrls: ['./rank-list.component.css']
})
export class RankListComponent implements OnInit {
  @Input() rankListTitle = '';
  @Input() rankList: RankItem[];

  constructor() { }

  ngOnInit(): void {}

}
