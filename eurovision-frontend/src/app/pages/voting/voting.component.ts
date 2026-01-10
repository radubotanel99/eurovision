import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EurovisionService } from '../../services/eurovision.service';
import { AudioService } from '../../services/audio.service';
import { Country } from '../../models/country.interface';
import { Vote } from '../../models/vote.interface';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css'
})
export class VotingComponent implements OnInit {
  countries: Country[] = [];
  userCountry: Country | null = null;
  isLoading = true;
  errorMessage = '';
  isSubmitting = false;
  selectedVideoUrl: SafeResourceUrl | null = null;
  selectedCountry: Country | null = null;
  
  // Voting form data
  votes: Map<string, number> = new Map();
  eurovisionPoints = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

  constructor(
    private eurovisionService: EurovisionService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private audioService: AudioService
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
        // Don't initialize votes - they need to be selected
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load countries. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getCleanVideoId(videoId: string): string {
    return videoId.split('&')[0];
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

  openCountryModal(country: Country): void {
    this.selectedCountry = country;
    const cleanId = this.getCleanVideoId(country.song.youtubeVideoId);
    const url = `https://www.youtube.com/embed/${cleanId}?modestbranding=1&controls=1&rel=0&autoplay=1`;
    this.selectedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // Pause background music when YouTube video modal opens
    this.audioService.pause();
  }

  closeModal(): void {
    this.selectedCountry = null;
    this.selectedVideoUrl = null;
    // Resume background music when YouTube video modal closes
    this.audioService.resume();
  }

  playVideo(country: Country): void {
    // Keep for backward compatibility if needed
    this.openCountryModal(country);
  }

  updateVote(countryName: string, points: number | string): void {
    const pointsNum = typeof points === 'string' ? parseInt(points, 10) : points;
    const oldVote = this.votes.get(countryName);
    
    if (pointsNum && !isNaN(pointsNum) && pointsNum > 0) {
      // Check if this point value is already assigned to another country
      let isAssignedToOther = false;
      this.votes.forEach((assignedPoints, assignedCountry) => {
        if (assignedCountry !== countryName && assignedPoints === pointsNum) {
          isAssignedToOther = true;
        }
      });
      
      // Only set if not assigned to another country
      if (!isAssignedToOther) {
        this.votes.set(countryName, pointsNum);
      }
    } else {
      // Remove vote if empty/invalid
      this.votes.delete(countryName);
    }
  }

  getVote(countryName: string): number | string {
    const vote = this.votes.get(countryName);
    return vote !== undefined && vote !== null ? vote : '';
  }

  getAvailablePoints(countryName: string): number[] {
    // Get all points currently assigned to other countries
    const assignedPoints = new Set<number>();
    this.votes.forEach((points, name) => {
      if (name !== countryName && points > 0) {
        assignedPoints.add(points);
      }
    });
    
    // Return all points except those assigned to other countries
    // The current country's own vote is always available (so they can keep it)
    return this.eurovisionPoints.filter(points => !assignedPoints.has(points));
  }

  canSubmit(): boolean {
    // Check if all countries have votes and all votes are > 0 (including 1)
    return this.countries.length > 0 && 
           this.countries.every(country => {
             const vote = this.votes.get(country.name);
             return vote !== undefined && vote !== null && vote > 0;
           });
  }

  submitVotes(): void {
    if (!this.canSubmit() || !this.userCountry) {
      this.errorMessage = 'Please assign points to all countries before submitting.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Convert votes map to Vote array
    const voteArray: Vote[] = [];
    this.votes.forEach((points, countryName) => {
      if (points > 0) {
        voteArray.push({
          votingCountry: this.userCountry!.name,
          votedForCountry: countryName,
          points: points
        });
      }
    });

    this.eurovisionService.submitVotes(voteArray).subscribe({
      next: () => {
        console.log('Votes submitted successfully');
        this.isSubmitting = false;
        this.router.navigate(['/results-transition']);
      },
      error: (error) => {
        console.error('Error submitting votes:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to submit votes. Please try again.';
      }
    });
  }
}


