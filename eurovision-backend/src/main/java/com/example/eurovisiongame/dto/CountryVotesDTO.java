package com.example.eurovisiongame.dto;

import java.util.List;

public class CountryVotesDTO {
    private String countryName;
    private List<ResultVotesDTO> votes;

    public CountryVotesDTO() {
    }

    public CountryVotesDTO(String countryName, List<ResultVotesDTO> votes) {
        this.countryName = countryName;
        this.votes = votes;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public List<ResultVotesDTO> getVotes() {
        return votes;
    }

    public void setVotes(List<ResultVotesDTO> votes) {
        this.votes = votes;
    }
}
