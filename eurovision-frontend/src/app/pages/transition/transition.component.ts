import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transition.component.html',
  styleUrl: './transition.component.css'
})
export class TransitionComponent implements OnInit {
  message: string = '';
  targetRoute: string = '';
  duration: number = 3500; // 3.5 seconds default

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get message from query parameters
    this.message = this.route.snapshot.queryParams['message'] || 
      'Curtain up. Lights on. You\'re LIVE. Give it everything you\'ve got!';
    
    // Get target route from query parameters
    this.targetRoute = this.route.snapshot.queryParams['target'] || '/my-performance';
    
    // Get custom duration if provided
    const customDuration = this.route.snapshot.queryParams['duration'];
    if (customDuration) {
      this.duration = parseInt(customDuration, 10);
    }

    // Navigate to target route after duration
    setTimeout(() => {
      this.router.navigate([this.targetRoute]);
    }, this.duration);
  }

  formatMessage(message: string): string {
    // Replace line breaks and format the message
    return message.replace(/\n/g, '<br>');
  }
}
