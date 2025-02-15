import React, { useState, useEffect } from "react";
import { TextField, List, ListItem, ListItemText, CircularProgress, Box, Grid2, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import GuessesTable from "./GuessesTable";
import axios from "axios";

const SearchBar = ({ songToGuess }) => {
    const [query, setQuery] = useState(""); // Search input value
    const [results, setResults] = useState([]); // Search results
    const [loading, setLoading] = useState(false); // Loading state
    const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query
    const [accessToken, setAccessToken] = useState(null);
    const [guessingData, setGuessingData] = useState([]);
    const [guessedTrack, setGuessedTrack] = useState({});
    const [winModalOpen, setWinModalOpen] = useState(false);
    const [hintsDialogOpen, setHintsDialogOpen] = useState(false);
    const [revealedHints, setRevealedHints] = useState({
        name: false,
        artists: false,
        album: false,
        year: false,
    });

    const songToMatch = songToGuess;

    const modalStyles = {
        paper: {
            backgroundColor: '#191414', // Dark Spotify background color
            color: '#fff', // White text for contrast
            borderRadius: '8px', // Rounded corners for a smooth look
            padding: '20px', // Padding for spacing inside the modal
            maxWidth: '400px', // Limit the width to maintain a compact look
            textAlign: 'center', // Center the text inside the modal
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white', // Spotify's signature green color
        },
        content: {
            fontSize: '1.1rem',
            margin: '10px 0',
        },
        button: {
            backgroundColor: '#1DB954', // Spotify green
            color: '#fff', // White text
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
                backgroundColor: '#1ED760', // Slightly brighter green on hover
            },
        },
    };

    const handleHintReveal = (hint) => {
        setRevealedHints((prevState) => ({
            ...prevState,
            [hint]: !prevState[hint],
        }));
    };

    const handleHintClose = () => {
        setRevealedHints({
            name: false,
            artists: false,
            album: false,
            year: false,
        });
        setHintsDialogOpen(false)
    }

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

    // Debounce effect: Updates debouncedQuery only after 500ms of inactivity
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(handler); // Cleanup function to prevent multiple timeouts
    }, [query]);

    // Effect to call API when debouncedQuery changes
    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URI}/search`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { query: debouncedQuery },
                });

                //setResults(response.data.items); // Store search results

                const trackInfo = response?.data?.items.map((track) => {
                    const trackName = track.name;
                    const artists = track.artists.map((artist) => artist.name).join(', ');
                    const albumName = track.album.name;
                    const imageUrl = track.album.images[0]?.url;
                    const id = track.id;

                    return { id, trackName, artists, albumName, imageUrl };
                });
                setResults(trackInfo)
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedQuery, accessToken]);

    useEffect(() => {
        if (Object.keys(guessedTrack).length === 0) return; // Prevent running on initial render

        const isCorrectName = guessedTrack.name === songToMatch.name;

        //This use effect will compare the fields and add the results to the guesses array
        const guess = {};

        if (isCorrectName) {
            setWinModalOpen(true); // Show the win modal
        }

        //Handle logic for name comparison
        guess['Name'] = {
            'Text': guessedTrack.name,
            'Colour': guessedTrack.name === songToMatch.name ? "#1DB954" : "red",
            'Icon': null
        }

        //Handle logic for release date comparison
        const guessedYear = parseInt(guessedTrack.released.split("-")[0], 10);
        const actualYear = parseInt(songToMatch.released.split("-")[0], 10);
        let releaseComparison = {
            'Text': guessedYear,
            'Colour': "red",
            'Icon': null
        };
        if (guessedYear === actualYear) {
            releaseComparison.Colour = "#1DB954";
        } else if (Math.abs(guessedYear - actualYear) === 1) {
            releaseComparison.Colour = "yellow"
        } else {
            releaseComparison.Colour = "red"
        }
        if (Math.abs(actualYear - guessedYear) > 1){
            if (guessedYear > actualYear){
                releaseComparison.Icon = 'down'
            } else {
                releaseComparison.Icon = "up"
            } 
        }
        guess['Released'] = releaseComparison;

        //Handle logic for album name
        guess['Album'] = {
            'Text': guessedTrack.album,
            'Colour': guessedTrack.album === songToMatch.album ? "#1DB954" : "red",
            'Icon': null
        };

        //Handle logic for popularity score
        let popularityComparison = {
            'Text': `${guessedTrack.popularity} / 100`,
            'Colour': "red",
            'Icon': null
        };

        if (guessedTrack.popularity === songToMatch.popularity) {
            popularityComparison.Colour = "#1DB954";
        } else if (guessedTrack.popularity < songToMatch.popularity) {
            if (Math.abs(guessedTrack.popularity - songToMatch.popularity) <= 10) {
                popularityComparison.Colour = "yellow";
            } else {
                popularityComparison.Colour = "red";
            }
            popularityComparison.Icon = "up";
        } else {
            if (Math.abs(guessedTrack.popularity - songToMatch.popularity) <= 10) {
                popularityComparison.Colour = "yellow";
            } else {
                popularityComparison.Colour = "red";
            }
            popularityComparison.Icon = "down";
        }
        guess['Popularity'] = popularityComparison;

        //Handle logic for song length
        const lengthDifference = Math.abs(guessedTrack.songLength - songToMatch.songLength);
        let songLengthComparison = {
            'Text': formatSongLength(guessedTrack.songLength),
            'Colour': "red",
            'Icon': null
        };

        if (lengthDifference === 0) {
            songLengthComparison.Colour = "#1DB954";
        } else if (lengthDifference <= 30000) { // 5 seconds margin
            songLengthComparison.Colour = "yellow";
            songLengthComparison.Icon = guessedTrack.songLength < songToMatch.songLength ? "up" : "down";
        } else {
            songLengthComparison.Icon = guessedTrack.songLength < songToMatch.songLength ? "up" : "down";
        }
        guess['Length'] = songLengthComparison;

        //Handle logic for artists
        const guessedArtists = new Set(guessedTrack.artists.map(artist => artist.toLowerCase()));
        const actualArtists = new Set(songToMatch.artists.map(artist => artist.toLowerCase()));

        let artistComparison = {
            'Text': guessedTrack.artists.join(", "),
            'Colour': "red",
            'Icon': null
        };

        if ([...guessedArtists].every(artist => actualArtists.has(artist)) &&
            [...actualArtists].every(artist => guessedArtists.has(artist))) {
            artistComparison.Colour = "#1DB954";
        } else if ([...guessedArtists].some(artist => actualArtists.has(artist))) {
            artistComparison.Colour = "yellow";
        };
        guess['Artists'] = artistComparison;


        setGuessingData(guessingData => [...guessingData, guess]);

    }, [guessedTrack, songToMatch]);

    const formatSongLength = (ms) => {
        const minutes = Math.floor(ms / 60000); // Convert ms to minutes
        const seconds = Math.floor((ms % 60000) / 1000); // Get remaining seconds
        return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Ensure two-digit seconds
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleSongGuess = async (songId) => {
        setLoading(true)
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}/song`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { songId: songId }
            });


            setGuessedTrack({
                'name': response?.data?.name,
                'released': response?.data?.album?.release_date,
                'album': response?.data?.album?.name,
                'popularity': response?.data?.popularity,
                'songLength': response?.data?.duration_ms,
                'artists': response?.data?.artists.map(artist => artist.name)
            })

        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Grid2 container spacing={2}>
            <Dialog
                open={winModalOpen}
                onClose={handleRefresh}
                slotProps={{
                    paper: {
                        style: modalStyles,
                    },
                }}
            >
                <DialogTitle style={modalStyles.title}>
                    🎉 You Won in {guessingData.length} Tries! 🎉
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Album Art */}
                        {songToMatch.image && (
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    marginRight: 2,
                                }}
                            >
                                <img
                                    src={songToMatch.image}
                                    alt="Album Art"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        )}

                        {/* Song Details */}
                        <Box>
                            <Typography variant="h6" color="#1DB954" style={modalStyles.content} sx={{fontWeight: 'bold'}}>
                                {songToMatch.name}
                            </Typography>
                            <Typography variant="body2" style={modalStyles.content}>
                                <strong>Released:</strong> {songToMatch.released}
                            </Typography>
                            <Typography variant="body2" style={modalStyles.content}>
                                <strong>Album:</strong> {songToMatch.album}
                            </Typography>
                            <Typography variant="body2" style={modalStyles.content}>
                                <strong>Artists:</strong> {songToMatch.artists.join(', ')}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
                    <Button onClick={handleRefresh} variant="contained" style={modalStyles.button}>
                        Click to Start a New Game
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={hintsDialogOpen} onClose={() => setHintsDialogOpen(false)}>
                <DialogTitle sx={{fontWeight: 'bold'}}>Song Hints</DialogTitle>
                <DialogContent>
                    <Box>
                        {/* Name Hint */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Name:</strong>{' '}
                            <Button
                                onClick={() => handleHintReveal('name')}
                                sx={{ textTransform: 'none', color:'#1DB954', fontWeight:'bold' }}
                            >
                                {revealedHints.name ? songToMatch.name : 'Click to Reveal'}
                            </Button>
                        </Typography>

                        {/* Artists Hint */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Artists:</strong>{' '}
                            <Button
                                onClick={() => handleHintReveal('artists')}
                                sx={{ textTransform: 'none', color:'#1DB954', fontWeight:'bold' }}
                            >
                                {revealedHints.artists ? songToMatch.artists.join(', ') : 'Click to Reveal'}
                            </Button>
                        </Typography>

                        {/* Album Hint */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Album:</strong>{' '}
                            <Button
                                onClick={() => handleHintReveal('album')}
                                sx={{ textTransform: 'none', color:'#1DB954', fontWeight:'bold' }}
                            >
                                {revealedHints.album ? songToMatch.album : 'Click to Reveal'}
                            </Button>
                        </Typography>

                        {/* Year Hint */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Year:</strong>{' '}
                            <Button
                                onClick={() => handleHintReveal('year')}
                                sx={{ textTransform: 'none', color:'#1DB954', fontWeight:'bold' }}
                            >
                                {revealedHints.year ? songToMatch.released : 'Click to Reveal'}
                            </Button>
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleHintClose()} style={modalStyles.button} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid2 item xs={12} sm={6} sx={{ width: '30%' }}>
                <Box
                    style={{
                        width: "100%",
                        padding: "20px",
                        backgroundColor: "#121212", // Dark Spotify theme
                        borderRadius: "10px",
                    }}
                >
                    {/* ---- Search Input ---- */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search for a song..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            marginBottom: "15px",
                            borderRadius: "50px",
                            outline: "white",
                            borderColor: "white"
                        }}
                    />

                    {/* ---- Loading Indicator ---- */}
                    {loading && <CircularProgress size={24} style={{ margin: "10px auto", display: "block", color: "#1DB954" }} />}

                    {/* ---- Search Results List ---- */}
                    <List style={{ backgroundColor: "#181818", borderRadius: "8px", padding: "10px" }}>
                        {results.map((track) => (
                            <ListItem
                                key={track.id}
                                button
                                onClick={() => handleSongGuess(track.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "0.2s ease-in-out",
                                    cursor: "pointer",
                                    backgroundColor: "#1E1E1E",
                                    color: "#fff",
                                    border: "1px solid transparent",
                                    "&:hover": {
                                        backgroundColor: "#282828",
                                        borderColor: "#1DB954",
                                    },
                                }}
                            >
                                <img
                                    src={track.imageUrl}
                                    alt={track.trackName}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        marginRight: "15px",
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                    }}
                                />
                                <ListItemText
                                    primary={track.trackName}
                                    secondary={
                                        <span style={{ color: "#B3B3B3", fontSize: "14px" }}>
                                            {track.artists.toString()} ({track.albumName})
                                        </span>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Grid2>
            <Grid2 item xs={12} sm={6} sx={{ width: '65%' }}>
                <GuessesTable guesses={guessingData} />
                <Button variant="contained" onClick={() => setHintsDialogOpen(true)} style={modalStyles.button} sx={{ width: '95%' }}>
                    Get Hints for the Song
                </Button>
            </Grid2>
        </Grid2>


    );
};

export default SearchBar;