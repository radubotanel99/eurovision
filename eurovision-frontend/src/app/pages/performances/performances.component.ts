import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EurovisionService } from '../../services/eurovision.service';
import { Country } from '../../models/country.interface';

@Component({
  selector: 'app-performances',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.css'
})
export class PerformancesComponent implements OnInit {
  countries: Country[] = [];
  userCountry: Country | null = null;
  isLoading = true;
  errorMessage = '';
  selectedVideoUrl: SafeResourceUrl | null = null;
  selectedCountry: Country | null = null;
  watchedCountries: Set<string> = new Set();

  constructor(
    private eurovisionService: EurovisionService,
    private router: Router,
    private sanitizer: DomSanitizer
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
        // Filter out user's country
        this.countries = data.filter(country => !country.userCountry);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load performances. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getYouTubeThumbnail(videoId: string): string {
    let cleanId = videoId.split('&')[0];
    return `https://img.youtube.com/vi/${cleanId}/default.jpg`;
  }

  getCleanVideoId(videoId: string): string {
    return videoId.split('&')[0];
  }

  playVideo(country: Country): void {
    this.selectedCountry = country;
    // Mark country as watched
    this.watchedCountries.add(country.name);
    const cleanId = this.getCleanVideoId(country.song.youtubeVideoId);
    const url = `https://www.youtube.com/embed/${cleanId}?autoplay=1`;
    this.selectedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isWatched(country: Country): boolean {
    return this.watchedCountries.has(country.name);
  }

  areAllCountriesWatched(): boolean {
    return this.countries.length > 0 && this.watchedCountries.size === this.countries.length;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  continueToVoting(): void {
    if (this.areAllCountriesWatched()) {
      this.router.navigate(['/voting']);
    }
  }
}


