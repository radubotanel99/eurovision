import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EurovisionService } from '../../services/eurovision.service';
import { Country } from '../../models/country.interface';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  countries: Country[] = [];
  userCountry: Country | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private eurovisionService: EurovisionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadData();
  }

  loadData(): void {
    // Load user country first
    this.eurovisionService.getUserCountry().subscribe({
      next: (userCountry) => {
        this.userCountry = userCountry;
        // Then load all countries
        this.loadCountries();
      },
      error: (error) => {
        console.error('Error loading user country:', error);
        // Still try to load countries even if user country fails
        this.loadCountries();
      }
    });
  }

  loadCountries(): void {
    this.eurovisionService.getCountries().subscribe({
      next: (data) => {
        // Sort by total points (descending)
        this.countries = data.sort((a, b) => b.totalPoints - a.totalPoints);
        this.isLoading = false;
        // Trigger celebration when results are loaded
        this.celebrate();
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load results. Please try again.';
        this.isLoading = false;
      }
    });
  }

  celebrate(): void {
    // Create a confetti burst
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Launch confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Also do a big burst in the center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  getWinner(): Country | null {
    return this.countries.length > 0 ? this.countries[0] : null;
  }

  getUserCountryPosition(): number {
    if (!this.userCountry) return -1;
    return this.countries.findIndex(c => c.name === this.userCountry!.name) + 1;
  }

  isWinner(country: Country): boolean {
    const winner = this.getWinner();
    return winner !== null && country.name === winner.name;
  }

  isUserCountry(country: Country): boolean {
    return this.userCountry !== null && country.name === this.userCountry.name;
  }

  viewStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  playAgain(): void {
    this.router.navigate(['/select-country']);
  }
}


