import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EurovisionService } from '../../services/eurovision.service';
import { Country } from '../../models/country.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  showForm = false;
  countries: Country[] = [];
  showCountryDropdown = false;
  isSubmitting = false;
  errorMessage = '';
  
  userData = {
    country: ''
  };

  formErrors = {
    country: ''
  };

  constructor(private eurovisionService: EurovisionService) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.eurovisionService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.errorMessage = '';
    document.body.style.overflow = 'hidden';
  }

  closeForm(): void {
    this.showForm = false;
    document.body.style.overflow = '';
    this.showCountryDropdown = false;
    this.resetForm();
  }

  resetForm(): void {
    this.userData = {
      country: ''
    };
    this.formErrors = {
      country: ''
    };
    this.errorMessage = '';
    this.showCountryDropdown = false;
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = { country: '' };

    if (!this.userData.country) {
      this.formErrors.country = 'Please select a country';
      isValid = false;
    }

    return isValid;
  }

  submitForm(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      this.eurovisionService.updateUserCountry(this.userData.country).subscribe({
        next: (response) => {
          console.log('Country updated successfully:', response);
          this.isSubmitting = false;
          this.closeForm();
          // TODO: Handle successful submission (e.g., navigate to next page or show success message)
        },
        error: (error) => {
          console.error('Error updating country:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Failed to update country. Please try again.';
        }
      });
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeForm();
    }
  }

  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  selectCountry(countryName: string): void {
    this.userData.country = countryName;
    this.showCountryDropdown = false;
    // Clear error when country is selected
    if (this.formErrors.country) {
      this.formErrors.country = '';
    }
  }

  closeCountryDropdown(): void {
    this.showCountryDropdown = false;
  }
}


