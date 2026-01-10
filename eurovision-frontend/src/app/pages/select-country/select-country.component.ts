import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EurovisionService } from '../../services/eurovision.service';
import { Country } from '../../models/country.interface';

@Component({
  selector: 'app-select-country',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-country.component.html',
  styleUrl: './select-country.component.css'
})
export class SelectCountryComponent implements OnInit {
  countries: Country[] = [];
  isLoading = true;
  errorMessage = '';
  isSubmitting = false;
  selectedCountry: Country | null = null;

  constructor(
    private eurovisionService: EurovisionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadCountries();
  }

  loadCountries(): void {
    this.eurovisionService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load countries. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectCountry(countryName: string): void {
    this.selectedCountry = this.countries.find(c => c.name === countryName) || null;
  }

  submitSelection(): void {
    if (!this.selectedCountry) {
      this.errorMessage = 'Please select a country';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.eurovisionService.updateUserCountry(this.selectedCountry).subscribe({
      next: () => {
        console.log('Country updated successfully');
        this.isSubmitting = false;
        // Navigate to transition page with message and target route
        this.router.navigate(['/transition'], {
          queryParams: {
            message: 'Curtain up. Lights on. You\'re LIVE. Give it everything you\'ve got!',
            target: '/my-performance',
            duration: 5500
          }
        });
      },
      error: (error) => {
        console.error('Error updating country:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to update country. Please try again.';
      }
    });
  }

  getYouTubeThumbnail(videoId: string): string {
    let cleanId = videoId.split('&')[0];
    return `https://img.youtube.com/vi/${cleanId}/default.jpg`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }
}
