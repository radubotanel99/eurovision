package com.example.eurovisiongame.dto;

public class ResultVotesDTO {
    private int points;
    private String votedByCountryName;

    public ResultVotesDTO() {
    }

    public ResultVotesDTO(int points, String votedByCountryName) {
        this.points = points;
        this.votedByCountryName = votedByCountryName;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getVotedByCountryName() {
        return votedByCountryName;
    }

    public void setVotedByCountryName(String votedByCountryName) {
        this.votedByCountryName = votedByCountryName;
    }
}
