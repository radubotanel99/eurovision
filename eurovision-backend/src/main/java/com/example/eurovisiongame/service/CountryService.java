package com.example.eurovisiongame.service;

import com.example.eurovisiongame.model.Country;
import com.example.eurovisiongame.model.Song;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CountryService {
    private final List<Country> countries = new ArrayList<>();

    public CountryService() {
        initializeCountries();
    }

    private void initializeCountries() {
        countries.add(new Country("Romania", 0, false, new Song("Theodor Andrei", "D.G.T. (Off and On)", "NRxv-AUCinQ")));
        countries.add(new Country("France", 0, false, new Song("Slimane", "Mon Amour", "-XyLecY2JyE")));
        countries.add(new Country("Spain", 0, false, new Song("Nebulossa", "ZORRA", "FOMoQoHG5aU")));
        countries.add(new Country("Germany", 0, false, new Song("ISAAK", "Always On The Run", "kVOHTxFOhak")));
        countries.add(new Country("Italy", 0, false, new Song("Angelina Mango", "La noia", "zp1FXHjkjpQ")));
        countries.add(new Country("United Kingdom", 0, false, new Song("Olly Alexander", "Dizzy", "q0_FdJqyQW0")));
        countries.add(new Country("Ukraine", 0, false, new Song("alyona alyona & Jerry Heil", "Teresa & Maria", "d4N82wPpdg8")));
        countries.add(new Country("Sweden", 0, false, new Song("Marcus & Martinus", "Unforgettable", "DcZpzObYzxs")));
        countries.add(new Country("Switzerland", 0, false, new Song("Nemo", "The Code", "CO_qJf-nW0k")));
        countries.add(new Country("Croatia", 0, false, new Song("Baby Lasagna", "Rim Tim Tagi Dim", "YIBjarAiAVc")));
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

    public void setUserCountry(String countryName) {
        countries.forEach(country -> country.setUserCountry(country.getName().equalsIgnoreCase(countryName)));
    }
}
