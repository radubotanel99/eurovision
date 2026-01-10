import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-performance-complete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-complete.component.html',
  styleUrl: './performance-complete.component.css'
})
export class PerformanceCompleteComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  goToPerformances(): void {
    this.router.navigate(['/performances']);
  }
}
