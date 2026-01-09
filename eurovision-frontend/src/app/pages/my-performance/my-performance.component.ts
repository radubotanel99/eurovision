import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EurovisionService } from '../../services/eurovision.service';
import { Country } from '../../models/country.interface';

@Component({
  selector: 'app-my-performance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-performance.component.html',
  styleUrl: './my-performance.component.css'
})
export class MyPerformanceComponent implements OnInit {
  userCountry: Country | null = null;
  isLoading = true;
  errorMessage = '';
  safeVideoUrl: SafeResourceUrl | null = null;

  constructor(
    private eurovisionService: EurovisionService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadUserCountry();
  }

  loadUserCountry(): void {
    this.eurovisionService.getUserCountry().subscribe({
      next: (data) => {
        this.userCountry = data;
        if (data.song.youtubeVideoId) {
          this.safeVideoUrl = this.getYouTubeEmbedUrl(data.song.youtubeVideoId);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user country:', error);
        this.errorMessage = 'Failed to load your country. Please select a country first.';
        this.isLoading = false;
      }
    });
  }

  getCleanVideoId(videoId: string): string {
    // Extract clean video ID (handle &list= parameters)
    return videoId.split('&')[0];
  }

  getYouTubeEmbedUrl(videoId: string): SafeResourceUrl {
    const cleanId = this.getCleanVideoId(videoId);
    const url = `https://www.youtube.com/embed/${cleanId}?autoplay=1&mute=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

  continueToPerformances(): void {
    this.router.navigate(['/performances']);
  }
}

