package com.example.eurovisiongame.controller;

import com.example.eurovisiongame.dto.CountryVotesDTO;
import com.example.eurovisiongame.model.Country;
import com.example.eurovisiongame.model.Vote;
import com.example.eurovisiongame.service.VoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vote")
public class VoteController {

    private final String RESULTS_API = "/results";
    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping
    public ResponseEntity<String> setUserVotes(@RequestBody List<Vote> userVotes) {
        voteService.setUserVotes(userVotes);
        return ResponseEntity.status(HttpStatus.OK).body("Votes received successfully");
    }

    @GetMapping
    public ResponseEntity<List<Vote>> getVotes() {
        return ResponseEntity.ok(voteService.getVotes());
    }

    @GetMapping(RESULTS_API)
    public ResponseEntity<List<CountryVotesDTO>> getCountryVotesList() {
        return ResponseEntity.ok(voteService.getCountryVotesList());
    }
}
