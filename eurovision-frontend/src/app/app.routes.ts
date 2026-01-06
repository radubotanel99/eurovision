import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PerformancesComponent } from './pages/performances/performances.component';
import { VotingComponent } from './pages/voting/voting.component';
import { ResultsComponent } from './pages/results/results.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
    path: '**',
    redirectTo: '',
  },
];
