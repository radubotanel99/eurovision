package com.example.eurovisiongame.model;

public class Vote {
    private String votingCountry;
    private String votedForCountry;
    private int points;

    public Vote() {}

    public Vote(String votingCountry, String votedForCountry, int points) {
        this.votingCountry = votingCountry;
        this.votedForCountry = votedForCountry;
        this.points = points;
    }

    public String getVotingCountry() {
        return votingCountry;
    }

    public void setVotingCountry(String votingCountry) {
        this.votingCountry = votingCountry;
    }

    public String getVotedForCountry() {
        return votedForCountry;
    }

    public void setVotedForCountry(String votedForCountry) {
        this.votedForCountry = votedForCountry;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    @Override
    public String toString() {
        return "Vote{" +
                "votingCountry='" + votingCountry + '\'' +
                ", votedForCountry='" + votedForCountry + '\'' +
                ", points=" + points +
                '}';
    }
}
