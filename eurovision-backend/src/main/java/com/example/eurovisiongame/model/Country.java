package com.example.eurovisiongame.model;

public class Country {
    private String name;
    private int totalPoints;
    private boolean isUserCountry;
    private Song song;

    public Country() {}

    public Country(String name, int totalPoints, boolean isUserCountry, Song song) {
        this.name = name;
        this.totalPoints = totalPoints;
        this.isUserCountry = isUserCountry;
        this.song = song;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public boolean isUserCountry() {
        return isUserCountry;
    }

    public void setUserCountry(boolean userCountry) {
        isUserCountry = userCountry;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    @Override
    public String toString() {
        return "Country{" +
                "name='" + name + '\'' +
                ", isUserCountry=" + isUserCountry +
                '}';
    }
}
