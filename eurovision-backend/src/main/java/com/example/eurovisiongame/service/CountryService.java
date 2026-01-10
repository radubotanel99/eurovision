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
        countries.add(new Country("Romania", 0, false, new Song("ROXEN", "Amnesia", "5ZWcsj_6Log&list=RD5ZWcsj_6Log&start_radio=1")));

        countries.add(new Country("Greece", 0, false, new Song("Klavdia", "Asteromáta", "UxzeTezgey4&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=17")));
        countries.add(new Country("Spain", 0, false, new Song("Melody", "ESA DIVA", "H46FB-rLh04&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=16")));
        countries.add(new Country("Portugal", 0, false, new Song("NAPA", "Deslocado", "-s1Cc2uEj3U&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=1")));
        countries.add(new Country("Italy", 0, false, new Song("Lucio Corsi", "Volevo Essere Un Duro", "mfAf9-5Oevw&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=4")));
        countries.add(new Country("Denmark", 0, false, new Song("Sissal", "Hallucination", "gdCAgiSIOUc&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=6")));
        countries.add(new Country("Lithuania", 0, false, new Song(
                "Katarsis", "Tavo Akys", "R2f2aZ6Fy58&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=9")));
        countries.add(new Country("Sweden", 0, false, new Song("KAJ", "Bara Bada Bastu", "WK3HOMhAeQY&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=2")));
        countries.add(new Country("Finland", 0, false, new Song(
                "Erika Vikman", "ICH KOMME", "Kg3QoTpnqyw&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=12")));
        countries.add(new Country("Iceland", 0, false, new Song("VÆB", "RÓA", "LZE1WzOwtQQ&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=7")));
        countries.add(new Country("Belgium", 0, false, new Song("Red Sebastian", "Strobe Lights", "oVrsnGFmuss&list=PLmWYEDTNOGULzNiFO-sTXK6Jn07gpfn7E&index=15")));
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
