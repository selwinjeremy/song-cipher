import React, { useState, useEffect } from "react";
import { Typography, Grid2, Card, CardMedia, Button } from "@mui/material";
import axios from "axios";
import SearchBar from './SpotifySearchBar';

const PlaylistChallenge = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [randomTrack, setRandomTrack] = useState({});
    const [visibleCount, setVisibleCount] = useState(10);

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

    useEffect(() => {
        if (!accessToken) return;

        const fetchRandomTrack = async () => {
            try {
                console.log(process.env)
                const uri = process.env.REACT_APP_API_URI + "/playlists";  // Access the environment variable
                console.log(uri); 
                const response = await axios.get(`${process.env.REACT_APP_API_URI}/playlists`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const playlistList = response?.data?.items.map(item => ({
                    'id': item.id,
                    'imageUrl': item.images.length > 0 ? item.images[0].url : null,
                    'ownerName': item.owner?.display_name || "Unknown",
                    'name': item.name
                }));

                setPlaylists(playlistList)

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

    useEffect(() => {
        if (!accessToken) return;

        const fetchRandomTrack = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URI}/userPlaylistSong`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { id: selectedPlaylist.id },
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

            } catch (error) {
                console.error("Error fetching playlists:", error.response?.data || error.message);
                console.log(error?.response)
                if (error.response?.status === 401) {
                    setAccessToken(null)
                }
            }
        };
        fetchRandomTrack();
    }, [selectedPlaylist, accessToken])

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist)
    };

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + 10);
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h3" color="textPrimary" gutterBottom>
                Playlist Challenge
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
                Select a playlist and guess the random song from it
            </Typography>

            <Grid2 container spacing={2} justifyContent="center">
                {playlists.slice(0, visibleCount).map((playlist) => (
                    <Grid2 item xs={12} sm={6} md={4} lg={2} key={playlist.id}>
                        <Card
                            onClick={() => handlePlaylistClick(playlist)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px",
                                borderRadius: "8px",
                                transition: "0.2s ease-in-out",
                                cursor: "pointer",
                                backgroundColor: "#1E1E1E",
                                color: "#fff",
                                border: "1px solid transparent",
                                width: "220px",
                                height: "80px",
                                '&:hover': {
                                    backgroundColor: "#282828",
                                    borderColor: "#1DB954",
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={playlist.imageUrl}
                                alt={playlist.name}
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "4px",
                                    flexShrink: 0,
                                    marginRight: "10px",
                                }}
                            />
                            <div style={{ flexGrow: 1, overflow: "hidden" }}>
                                <Typography
                                    variant="h6"
                                    style={{
                                        color: "#fff",
                                        fontSize: "14px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {playlist.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{
                                        color: "#B3B3B3",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {playlist.ownerName}
                                </Typography>
                            </div>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>

            {visibleCount < playlists.length && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLoadMore}
                    style={{ marginTop: "20px" }}
                >
                    Load More
                </Button>
            )}

            {randomTrack?.name && (
                <div>
                    <SearchBar songToGuess={randomTrack} />
                </div>
            )}

            {!accessToken && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        window.location.href = `${process.env.REACT_APP_API_URI}/login`;
                    }}
                >
                    Login with Spotify
                </Button>
            )}
        </div>
    );
};

export default PlaylistChallenge;
