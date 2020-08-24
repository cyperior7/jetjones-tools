import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DivisionSorterComponent } from './division-sorter/division-sorter.component';
import { RankingsComponent } from './rankings/rankings.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'divisionsorter', component: DivisionSorterComponent },
  { path: 'rankings', component:RankingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
