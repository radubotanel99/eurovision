package com.example.eurovisiongame.model;

import java.util.Objects;

public class Country {
    private String name;
    private int totalPoints;
    private boolean userCountry;
    private Song song;

    public Country() {}

    public Country(String name, int totalPoints, boolean userCountry, Song song) {
        this.name = name;
        this.totalPoints = totalPoints;
        this.userCountry = userCountry;
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
        return userCountry;
    }

    public void setUserCountry(boolean userCountry) {
        this.userCountry = userCountry;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Country country = (Country) o;
        return Objects.equals(name, country.name);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }

    @Override
    public String toString() {
        return "Country{" +
                "name='" + name + '\'' +
                ", isUserCountry=" + userCountry +
                '}';
    }
}
