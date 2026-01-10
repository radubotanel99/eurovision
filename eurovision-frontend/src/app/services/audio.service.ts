import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface TrackConfig {
  url: string;
  volume?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: string | null = null;
  private routerSubscription: Subscription | null = null;
  private isPausedByUser = false; // User-initiated pause (e.g., modal)
  private isPausedByVisibility = false; // Paused due to tab visibility
  private volume: number = 0.5; // Default volume (0-1)
  private userInteractionListener: (() => void) | null = null;
  private waitingForUserInteraction = false; // Track if we're waiting for user interaction to start

  // Route to track mapping
  private readonly trackMap: Map<string, TrackConfig> = new Map([
    // Track 1: Early pages (home, select-country, transition) - STOPS after these pages
    ['', { url: 'assets/music/OneSpaceRemains.mp3' }],
    ['select-country', { url: 'assets/music/OneSpaceRemains.mp3' }],
    ['transition', { url: 'assets/music/OneSpaceRemains.mp3' }],
    
    // Track 2: Voting page - very different song to see the difference
    ['voting', { url: 'assets/music/PublicVote.mp3' }],
    
    // Track 3: Results transition
    ['results-transition', { url: 'assets/music/LastToQualify.mp3' }],
    
    // Track 4: Results and Statistics pages
    ['results', { url: 'assets/music/WinnersWalk.mp3' }],
    ['statistics', { url: 'assets/music/WinnersWalk.mp3' }],
  ]);

  constructor(private router: Router) {
    this.initialize();
  }

  private initialize(): void {
    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        const route = this.extractRoute(url);
        this.handleRouteChange(route);
      });

    // Handle page visibility changes (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseForVisibility();
      } else {
        this.resumeFromVisibility();
      }
    });

    // Listen for user interactions to start playback if autoplay was blocked
    this.userInteractionListener = () => {
      // If we have audio and it's not playing, try to start it
      if (this.audio) {
        // If we're waiting for user interaction, try to play
        if (this.waitingForUserInteraction) {
          this.waitingForUserInteraction = false;
          // Only reset visibility pause, not user pause (user pause is for modals)
          this.isPausedByVisibility = false;
          this.play().catch((error) => {
            console.warn('Audio play on user interaction failed:', error);
          });
        } 
        // Or if audio is paused but not by user or visibility, try to play
        else if (this.audio.paused && !this.isPausedByUser && !this.isPausedByVisibility) {
          this.play().catch((error) => {
            console.warn('Audio play on user interaction failed:', error);
          });
        }
      }
    };
    // Use capture phase and make sure we catch all interactions
    document.addEventListener('click', this.userInteractionListener, { capture: true, passive: true });
    document.addEventListener('keydown', this.userInteractionListener, { capture: true, passive: true });
    document.addEventListener('touchstart', this.userInteractionListener, { capture: true, passive: true });
    document.addEventListener('mousedown', this.userInteractionListener, { capture: true, passive: true });

    // Handle initial route - try multiple times to catch router readiness
    const initializeRoute = () => {
      const routerUrl = this.router.url || '/';
      const initialRoute = this.extractRoute(routerUrl);
      this.handleRouteChange(initialRoute);
    };

    // Try immediately and multiple times to ensure we catch the route
    initializeRoute();
    setTimeout(initializeRoute, 0);
    setTimeout(initializeRoute, 100);
    setTimeout(initializeRoute, 500);
  }

  private extractRoute(url: string): string {
    if (!url || url === '/') {
      return '';
    }
    // Remove leading slash and query params
    const route = url.split('?')[0].replace(/^\//, '');
    return route || '';
  }

  private handleRouteChange(route: string): void {
    const trackConfig = this.trackMap.get(route);
    
    if (!trackConfig) {
      // No track configured for this route, stop current track
      this.stop();
      return;
    }

    // If same track is already playing and not paused, don't restart
    if (this.currentTrack === trackConfig.url && this.audio && !this.audio.paused && !this.isPausedByUser) {
      return;
    }

    // Load and play the new track (will stop current track first)
    this.loadTrack(trackConfig);
  }

  private loadTrack(config: TrackConfig): void {
    // Stop current track if playing
    this.stop();

    // Reset pause flags when loading new track
    this.isPausedByUser = false;
    this.isPausedByVisibility = false;
    this.waitingForUserInteraction = false;

    // Create new audio element
    this.audio = new Audio(config.url);
    this.audio.volume = config.volume !== undefined ? config.volume : this.volume;
    this.audio.loop = true; // Loop background music
    this.audio.preload = 'auto'; // Preload the audio
    
    // Handle audio events
    this.audio.addEventListener('ended', () => {
      // Restart if it ends (shouldn't happen with loop, but just in case)
      if (this.audio && !this.isPausedByUser && !this.isPausedByVisibility) {
        this.audio.play().catch(error => {
          console.warn('Audio autoplay prevented:', error);
        });
      }
    });

    this.audio.addEventListener('error', (error) => {
      console.error('Error loading audio:', error);
      this.audio = null;
      this.waitingForUserInteraction = false;
    });

    // Try to play on multiple events to maximize autoplay chances
    const tryPlay = () => {
      if (this.audio && this.audio.paused && !this.isPausedByUser && !this.isPausedByVisibility) {
        this.audio.play().then(() => {
          this.waitingForUserInteraction = false;
        }).catch((error) => {
          // Autoplay blocked - will need user interaction
          this.waitingForUserInteraction = true;
        });
      }
    };

    // Try playing on various audio readiness events
    this.audio.addEventListener('loadeddata', tryPlay);
    this.audio.addEventListener('canplay', tryPlay);
    this.audio.addEventListener('canplaythrough', tryPlay);
    this.audio.addEventListener('loadedmetadata', tryPlay);
    
    // Also try playing immediately and with multiple delays
    tryPlay();
    setTimeout(tryPlay, 50);
    setTimeout(tryPlay, 100);
    setTimeout(tryPlay, 200);
    setTimeout(tryPlay, 500);
    setTimeout(tryPlay, 1000);

    this.currentTrack = config.url;
  }

  private async play(): Promise<void> {
    if (!this.audio || this.isPausedByUser || this.isPausedByVisibility) {
      return;
    }

    try {
      await this.audio.play();
      this.waitingForUserInteraction = false; // Successfully started, no longer waiting
    } catch (error) {
      // Autoplay was prevented - user needs to interact first
      // The user interaction listener will try to play again
      console.warn('Audio play failed:', error);
      this.waitingForUserInteraction = true;
    }
  }

  pause(): void {
    if (this.audio) {
      if (!this.audio.paused) {
        this.audio.pause();
      }
      this.isPausedByUser = true;
    }
  }

  resume(): void {
    if (this.audio && this.isPausedByUser) {
      this.isPausedByUser = false;
      this.play().catch(error => {
        console.warn('Audio resume failed:', error);
      });
    }
  }

  private pauseForVisibility(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.isPausedByVisibility = true;
    }
  }

  private resumeFromVisibility(): void {
    if (this.audio && this.isPausedByVisibility && !this.isPausedByUser) {
      this.isPausedByVisibility = false;
      this.play().catch(error => {
        console.warn('Audio resume from visibility failed:', error);
      });
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
      this.currentTrack = null;
      this.isPausedByUser = false;
      this.isPausedByVisibility = false;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  isPlaying(): boolean {
    return this.audio !== null && !this.audio.paused && !this.isPausedByUser && !this.isPausedByVisibility;
  }

  // Method to manually trigger play (useful for user interaction)
  startPlayback(): void {
    this.isPausedByUser = false;
    this.isPausedByVisibility = false;
    this.play().catch(error => {
      console.warn('Manual audio start failed:', error);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.userInteractionListener) {
      document.removeEventListener('click', this.userInteractionListener, { capture: true });
      document.removeEventListener('keydown', this.userInteractionListener, { capture: true });
      document.removeEventListener('touchstart', this.userInteractionListener, { capture: true });
      document.removeEventListener('mousedown', this.userInteractionListener, { capture: true });
    }
    this.stop();
  }
}
