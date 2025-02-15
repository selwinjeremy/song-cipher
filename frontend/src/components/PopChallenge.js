import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import axios from "axios";
import SearchBar from './SpotifySearchBar';

const PopChallenge = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [randomTrack, setRandomTrack] = useState({});

  // Get access token from URL or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");

    if (token) {
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token); // Store token for later
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      if (storedToken) setAccessToken(storedToken);
    }
  }, []);

  // Fetch user's playlists when accessToken is available
  useEffect(() => {
    if (!accessToken) return;

    const fetchRandomTrack = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URI}/playlistSong`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { genre: 'pop' },
        });


        let trackName = response?.data?.track?.name;
        let releaseDate = response?.data?.track?.album?.release_date;
        let albumName = response?.data?.track?.album?.name;
        let popularityScore = response?.data?.track?.popularity;
        let trackLength = response?.data?.track?.duration_ms;
        let artists = response?.data?.track?.artists.map(artist => artist.name);
        let imageUrl = response?.data?.track?.album?.images[0]?.url;

        setRandomTrack({
          'name': trackName,
          'released': releaseDate,
          'album': albumName,
          'popularity': popularityScore,
          'songLength': trackLength,
          'artists': artists,
          'image': imageUrl
        });
        //Assign track metadata
        //Track Name , Released On , Album , Popularity Score , Artists , Track Length
      } catch (error) {
        console.error("Error fetching playlists:", error.response?.data || error.message);
        console.log(error?.response)
        if (error.response?.status === 401) {
          setAccessToken(null)
        }
      }
    };

    fetchRandomTrack();
  }, [accessToken]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h3" color="textPrimary" gutterBottom>
        Pop Challenge
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Guess the mainstream pop song based on the clues.
      </Typography>

      {/* Show playlists if they exist */}
      {randomTrack?.name !== undefined && (
        <div>
          <SearchBar songToGuess={randomTrack} />
        </div>
      )}

      {/* If no token, show login button */}
      {!accessToken && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.location.href = `${process.env.REACT_APP_API_URI}/login`; // Redirect to Spotify login
          }}
        >
          Login with Spotify
        </Button>
      )}
    </div>
  );
};

export default PopChallenge;
