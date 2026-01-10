import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SelectCountryComponent } from './pages/select-country/select-country.component';
import { MyPerformanceComponent } from './pages/my-performance/my-performance.component';
import { PerformancesComponent } from './pages/performances/performances.component';
import { VotingComponent } from './pages/voting/voting.component';
import { ResultsComponent } from './pages/results/results.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { TransitionComponent } from './pages/transition/transition.component';
import { PerformanceCompleteComponent } from './pages/performance-complete/performance-complete.component';
import { ResultsTransitionComponent } from './pages/results-transition/results-transition.component';

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
    path: 'transition',
    component: TransitionComponent,
  },
  {
    path: 'my-performance',
    component: MyPerformanceComponent,
  },
  {
    path: 'performance-complete',
    component: PerformanceCompleteComponent,
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
    path: 'results-transition',
    component: ResultsTransitionComponent,
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
