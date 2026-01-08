package com.example.eurovisiongame.controller;

import com.example.eurovisiongame.model.Country;
import com.example.eurovisiongame.service.CountryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping
    public ResponseEntity<List<Country>> getCountries() {
        return ResponseEntity.ok(countryService.getAllCountries());
    }

    @PutMapping
    public ResponseEntity<Void> setUserCountry(@RequestBody Country userCountry) {
        countryService.setUserCountry(userCountry);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
