package com.example.eurovisiongame.utils;

import com.example.eurovisiongame.model.Country;
import com.example.eurovisiongame.model.Vote;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class RandomGenerator {

    private final List<Integer> EUROVISION_POINTS = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 10, 12);

    public List<Vote> generateRandomVotes(List<Country> countries) {

        List<Vote> generatedVotes = new ArrayList<>();
        for (Country currentVotingCountry : countries) {
            if (currentVotingCountry.isUserCountry()) {
                continue;
            }

            List<Country> targets = new ArrayList<>(countries);
            targets.remove(currentVotingCountry);

            generatedVotes.addAll(generateCountryVote(currentVotingCountry, targets));
        }
        return generatedVotes;
    }

    private List<Vote> generateCountryVote(Country currentVotingCountry, List<Country> targets) {

        List<Integer> shuffledPoints = new ArrayList<>(EUROVISION_POINTS);
        Collections.shuffle(shuffledPoints);

        List<Vote> currentVotes = new ArrayList<>();
        for (int i = 0; i < targets.size(); i++) {
            currentVotes.add(new Vote(currentVotingCountry.getName(), targets.get(i).getName(), shuffledPoints.get(i)));
        }

        return currentVotes;
    }
}
