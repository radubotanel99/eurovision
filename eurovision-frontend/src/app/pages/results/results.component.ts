import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EurovisionService } from '../../services/eurovision.service';
import { Country } from '../../models/country.interface';

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
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load results. Please try again.';
        this.isLoading = false;
      }
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


