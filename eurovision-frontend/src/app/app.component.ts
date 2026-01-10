import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'eurovision-frontend';

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // AudioService initializes automatically via constructor
    // This ensures the service is instantiated when the app starts
  }
}
