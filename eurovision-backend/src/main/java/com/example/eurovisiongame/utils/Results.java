package com.example.eurovisiongame.utils;

import com.example.eurovisiongame.dto.CountryVotesDTO;
import com.example.eurovisiongame.dto.ResultVotesDTO;
import com.example.eurovisiongame.model.Country;
import com.example.eurovisiongame.model.Vote;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Results {

    public List<CountryVotesDTO> getResults(List<Country> countries, List<Vote> votes) {
        Map<String, List<Vote>> votesByCountry = new java.util.HashMap<>();

        for (Vote vote : votes) {
            String countryName = vote.getVotedForCountry();
            if (!votesByCountry.containsKey(countryName)) {
                votesByCountry.put(countryName, new ArrayList<>());
            }
            votesByCountry.get(countryName).add(vote);
        }

        return getCountryVotesDTOS(countries, votesByCountry);
    }

    private List<CountryVotesDTO> getCountryVotesDTOS(List<Country> countries, Map<String, List<Vote>> votesByCountry) {
        List<CountryVotesDTO> result = new ArrayList<>();
        for (Country country : countries) {
            String countryName = country.getName();
            List<Vote> countryVotes = votesByCountry.getOrDefault(countryName, new ArrayList<>());

            List<ResultVotesDTO> resultVotes = new ArrayList<>();
            for (Vote vote : countryVotes) {
                resultVotes.add(new ResultVotesDTO(vote.getPoints(), vote.getVotingCountry()));
            }

            result.add(new CountryVotesDTO(countryName, resultVotes));
        }

        return result;
    }
}
