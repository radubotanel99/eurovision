import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/country.interface';
import { Vote } from '../models/vote.interface';
import { CountryVotesDTO } from '../models/country-votes-dto.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EurovisionService {
  private apiUrl = environment.apiUrl;
  private countriesUrl = `${this.apiUrl}/countries`;
  private voteUrl = `${this.apiUrl}/vote`;

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesUrl);
  }

  updateUserCountry(country: Country): Observable<void> {
    return this.http.put<void>(`${this.countriesUrl}`, country, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getUserCountry(): Observable<Country> {
    return this.http.get<Country>(`${this.countriesUrl}/user`);
  }

  submitVotes(votes: Vote[]): Observable<string> {
    return this.http.post<string>(this.voteUrl, votes, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as 'json'
    });
  }

  getVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(this.voteUrl);
  }

  getCountryVotesList(): Observable<CountryVotesDTO[]> {
    return this.http.get<CountryVotesDTO[]>(`${this.voteUrl}/results`);
  }
}

