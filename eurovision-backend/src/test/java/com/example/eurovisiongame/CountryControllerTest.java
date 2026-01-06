package com.example.eurovisiongame;

import com.example.eurovisiongame.controller.CountryController;
import com.example.eurovisiongame.service.CountryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CountryControllerTest {

    @Autowired
    private CountryController countryController;

    @Autowired
    private CountryService countryService;

    @Test
    void contextLoads() {
        assertThat(countryController).isNotNull();
        assertThat(countryService).isNotNull();
    }

//    @Test
//    void shouldUpdateUserCountry() {
//        String countryName = "Romania";
//        String response = eurovisionController.setUserCountry(countryName);
//
//        assertThat(response).isEqualTo("OK");
//        assertThat(eurovisionController.getCountries().stream()
//                .filter(c -> c.getName().equals(countryName))
//                .findFirst().get().isUserCountry()).isTrue();
//    }
}
