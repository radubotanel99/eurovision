package com.example.eurovisiongame.service;

import com.example.eurovisiongame.dto.CountryVotesDTO;
import com.example.eurovisiongame.dto.ResultVotesDTO;
import com.example.eurovisiongame.model.Country;
import com.example.eurovisiongame.model.Vote;
import com.example.eurovisiongame.utils.RandomGenerator;
import com.example.eurovisiongame.utils.Results;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VoteService {

    private List<Vote> votes;
    private final CountryService countryService;

    public VoteService(CountryService countryService) {
        this.countryService = countryService;
    }

    public void setUserVotes(List<Vote> userVotes) {
        updateVotingCountry(votes);
        this.votes = userVotes;
    }

    private void updateVotingCountry(List<Vote> votes) {
        String name = countryService.getUserCountry().getName();
        votes.forEach(vote -> vote.setVotingCountry(name));
        generateRandomVotes();
    }

    private void generateRandomVotes() {
        List<Vote> randomVotes = new RandomGenerator().generateRandomVotes(countryService.getCountries());
        if (votes == null) {
            votes = new ArrayList<>();
        }
        votes.addAll(randomVotes);
        updateTotalPoints();
    }

    private void updateTotalPoints() {
        Map<String, Integer> pointsByCountryName = calculatePointsByCountryName();
        countryService.setTotalPoints(pointsByCountryName);
    }

    private Map<String, Integer> calculatePointsByCountryName() {
        Map<String, Integer> pointsMap = new HashMap<>();

        for (Vote vote : votes) {
            pointsMap.merge(vote.getVotedForCountry(), vote.getPoints(), Integer::sum);
        }
        return pointsMap;
    }

    public List<Vote> getVotes() {
        return votes;
    }

    public List<CountryVotesDTO> getCountryVotesList() {
        return new Results().getResults(countryService.getCountries(), this.votes);
    }
}
