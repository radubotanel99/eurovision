import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SelectCountryComponent } from './pages/select-country/select-country.component';
import { MyPerformanceComponent } from './pages/my-performance/my-performance.component';
import { PerformancesComponent } from './pages/performances/performances.component';
import { VotingComponent } from './pages/voting/voting.component';
import { ResultsComponent } from './pages/results/results.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'select-country',
    component: SelectCountryComponent,
  },
  {
    path: 'my-performance',
    component: MyPerformanceComponent,
  },
  {
    path: 'performances',
    component: PerformancesComponent,
  },
  {
    path: 'voting',
    component: VotingComponent,
  },
  {
    path: 'results',
    component: ResultsComponent,
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
