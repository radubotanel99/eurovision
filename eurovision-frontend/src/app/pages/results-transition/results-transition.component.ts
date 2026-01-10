import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results-transition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-transition.component.html',
  styleUrl: './results-transition.component.css'
})
export class ResultsTransitionComponent implements OnInit {
  duration: number = 20000; // 5 seconds default

  constructor(private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    // Navigate to results after duration
    setTimeout(() => {
      this.router.navigate(['/results']);
    }, this.duration);
  }
}
