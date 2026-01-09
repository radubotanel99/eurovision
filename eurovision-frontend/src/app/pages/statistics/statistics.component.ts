import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { EurovisionService } from '../../services/eurovision.service';
import { CountryVotesDTO } from '../../models/country-votes-dto.interface';
import { Vote } from '../../models/vote.interface';
import { Country } from '../../models/country.interface';

export interface TableRow {
  votedForCountry: string;
  [key: string]: string | number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  countryVotes: CountryVotesDTO[] = [];
  allVotes: Vote[] = [];
  userCountry: Country | null = null;
  isLoading = true;
  errorMessage = '';

  // Table data
  tableData: TableRow[] = [];
  displayedColumns: string[] = [];
  votedForCountries: string[] = [];
  votingCountries: string[] = [];

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
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Error loading user country:', error);
        this.loadStatistics();
      }
    });
  }

  loadStatistics(): void {
    // Load structured voting results
    this.eurovisionService.getCountryVotesList().subscribe({
      next: (data) => {
        this.countryVotes = data;
        // Also load all votes for detailed breakdown
        this.loadAllVotes();
      },
      error: (error) => {
        console.error('Error loading country votes:', error);
        this.errorMessage = 'Failed to load statistics. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadAllVotes(): void {
    this.eurovisionService.getVotes().subscribe({
      next: (data) => {
        this.allVotes = data;
        this.prepareTableData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading all votes:', error);
        this.isLoading = false;
      }
    });
  }

  prepareTableData(): void {
    // Get unique voting countries and voted-for countries
    const votingSet = new Set<string>();
    const votedForSet = new Set<string>();

    this.allVotes.forEach(vote => {
      votingSet.add(vote.votingCountry);
      votedForSet.add(vote.votedForCountry);
    });

    this.votingCountries = Array.from(votingSet).sort();
    this.votedForCountries = Array.from(votedForSet).sort();

    // Build vote matrix (votingCountry -> votedForCountry -> points)
    const voteMatrix = new Map<string, Map<string, number>>();
    this.votingCountries.forEach(votingCountry => {
      const countryMap = new Map<string, number>();
      this.votedForCountries.forEach(votedForCountry => {
        countryMap.set(votedForCountry, 0);
      });
      voteMatrix.set(votingCountry, countryMap);
    });

    // Fill in the actual votes
    this.allVotes.forEach(vote => {
      const countryMap = voteMatrix.get(vote.votingCountry);
      if (countryMap) {
        countryMap.set(vote.votedForCountry, vote.points);
      }
    });

    // Build table rows - each row is a voted-for country
    this.tableData = this.votedForCountries.map(votedForCountry => {
      const row: TableRow = { votedForCountry };
      let totalPoints = 0;
      
      // For each voting country (column), get the points they gave to this voted-for country
      this.votingCountries.forEach(votingCountry => {
        // Show '-' if voting country is the same as voted-for country
        if (votingCountry === votedForCountry) {
          row[votingCountry] = '-';
        } else {
          const countryMap = voteMatrix.get(votingCountry);
          const points = countryMap?.get(votedForCountry) || 0;
          row[votingCountry] = points;
          totalPoints += points;
        }
      });
      
      // Add total points received by this voted-for country
      row['total'] = totalPoints;
      
      return row;
    });

    // Set displayed columns (voted-for country + all voting countries + total)
    this.displayedColumns = ['votedForCountry', ...this.votingCountries, 'total'];
  }

  getCellValue(row: TableRow, column: string): string | number {
    return row[column];
  }

  isSelfVote(votedForCountry: string, votingCountry: string): boolean {
    return votingCountry === votedForCountry;
  }

  isUserVote(votingCountry: string): boolean {
    return this.userCountry !== null && votingCountry === this.userCountry.name;
  }

  isUserVotedForCountry(votedForCountry: string): boolean {
    return this.userCountry !== null && votedForCountry === this.userCountry.name;
  }

  getTotalPointsForCountry(countryName: string): number {
    const countryVote = this.countryVotes.find(cv => cv.countryName === countryName);
    if (!countryVote) return 0;
    return countryVote.votes.reduce((sum, vote) => sum + vote.points, 0);
  }

  getTotalPointsReceived(votedForCountry: string): number {
    return this.allVotes
      .filter(vote => vote.votedForCountry === votedForCountry)
      .reduce((sum, vote) => sum + vote.points, 0);
  }

  getTotalPointsForRow(row: TableRow): number {
    return row['total'] as number || 0;
  }

  getTotalPointsGiven(row: TableRow): number {
    return row['total'] as number || 0;
  }

  goBack(): void {
    this.router.navigate(['/results']);
  }
}