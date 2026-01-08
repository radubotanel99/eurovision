package com.example.eurovisiongame.service;

import com.example.eurovisiongame.model.Country;
import com.example.eurovisiongame.model.Song;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CountryService {
    private final List<Country> countries = new ArrayList<>();

    public CountryService() {
        initializeCountries();
    }

    private void initializeCountries() {
        countries.add(new Country("Romania", 0, false, new Song("Theodor Andrei", "D.G.T. (Off and On)", "NRxv-AUCinQ&list=PLmWYEDTNOGUIr757MlL8s9iyvYx-0lToh&index=24")));
        countries.add(new Country("France", 0, false, new Song("Louane", "maman", "ZFWzMZh47d0&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=1")));
        countries.add(new Country("Spain", 0, false, new Song("Melody", "ESA DIVA", "BvVxhbCW9rw&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=9")));
        countries.add(new Country("Germany", 0, false, new Song("Abor & Tynna", "Baller", "zJplC4-9Scs&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=19")));
        countries.add(new Country("Italy", 0, false, new Song("Lucio Corsi", "Volevo Essere Un Duro", "-Alz9MnqyZI&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=10")));
        countries.add(new Country("United Kingdom", 0, false, new Song("Remember Monday", "What The Hell Just Happened?", "-hu6R3ZnOdY&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=27")));
        countries.add(new Country("Ukraine", 0, false, new Song("Ziferblat", "Bird of Pray", "OJ1x2aiL7ks&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=21")));
        countries.add(new Country("Sweden", 0, false, new Song("KAJ", "Bara Bada Bastu", "WK3HOMhAeQY&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=25")));
        countries.add(new Country("Switzerland", 0, false, new Song("Zoë Më", "Voyage", "dGX54zRExR8&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=23")));
        countries.add(new Country("Ireland", 0, false, new Song("EMMY", "Laika Party", "cZnusVb7yjs&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=16")));
        countries.add(new Country("Belgium", 0, false, new Song("Red Sebastian", "Strobe Lights", "ScupiVTosHU&list=PLmWYEDTNOGUJG7RV2ARlG2OCpq8oNwz2s&index=18")));
    }

    public List<Country> getCountries() {
        return countries;
    }

    public List<Country> getAllCountries() {
        return getSortedCountries();
    }

    public List<Country> getSortedCountries() {
        return countries.stream()
                .sorted(Comparator.comparing(Country::getName))
                .collect(Collectors.toList());
    }

    public void setUserCountry(Country userCountry) {
        for (Country country : countries) {
            country.setUserCountry(country.equals(userCountry));
        }
    }

    public Country getUserCountry() {
        return countries.stream().filter(Country::isUserCountry).findFirst().orElse(null);
    }

    public void setTotalPoints(Map<String, Integer> pointsByCountryName) {
        for (Country country : this.countries) {
            Integer totalPoints = pointsByCountryName.getOrDefault(country.getName(), 0);
            country.setTotalPoints(totalPoints);
        }
    }
}
