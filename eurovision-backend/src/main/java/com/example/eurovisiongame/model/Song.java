package com.example.eurovisiongame.model;

public class Song {
    private String artistName;
    private String songTitle;
    private String youtubeVideoId;

    public Song() {}

    public Song(String artistName, String songTitle, String youtubeVideoId) {
        this.artistName = artistName;
        this.songTitle = songTitle;
        this.youtubeVideoId = youtubeVideoId;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getSongTitle() {
        return songTitle;
    }

    public void setSongTitle(String songTitle) {
        this.songTitle = songTitle;
    }

    public String getYoutubeVideoId() {
        return youtubeVideoId;
    }

    public void setYoutubeVideoId(String youtubeVideoId) {
        this.youtubeVideoId = youtubeVideoId;
    }
}
