import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/country.interface';

@Injectable({
  providedIn: 'root'
})
export class EurovisionService {
  private apiUrl = 'http://localhost:8080/api';
  private countriesUrl = `${this.apiUrl}/countries`;

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesUrl);
  }

  updateUserCountry(country: Country): Observable<void> {
    return this.http.put<void>(`${this.countriesUrl}`, country, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

