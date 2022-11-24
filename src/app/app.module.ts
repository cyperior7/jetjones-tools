import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DivisionSorterComponent } from './division-sorter/division-sorter.component';
import { RankingsComponent } from './rankings/rankings.component';
import { RankListComponent } from './rankings/rank-list/rank-list.component';
import { WeeklyStatsComponent } from './weekly-stats/weekly-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DivisionSorterComponent,
    RankingsComponent,
    RankListComponent,
    WeeklyStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
