import React, { useState, useEffect } from "react";
import { TextField, List, ListItem, ListItemText, CircularProgress, Box } from "@mui/material";
import axios from "axios";

const SearchBar = () => {
    const [query, setQuery] = useState(""); // Search input value
    const [results, setResults] = useState([]); // Search results
    const [loading, setLoading] = useState(false); // Loading state
    const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query
    const [accessToken, setAccessToken] = useState(null);

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
                const response = await axios.get(`http://localhost:5000/search`, {
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
                console.log(trackInfo)
                setResults(trackInfo)
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedQuery]);

    return (
        <Box style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <TextField
                fullWidth
                label="Search for a song"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && <CircularProgress size={24} style={{ marginTop: "10px" }} />}

            <List>
                {results.map((track) => (
                    <ListItem
                        key={track.id}
                        button
                        target="_blank"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            borderBottom: "1px solid #ddd",
                            padding: "10px 0"
                        }}
                    >
                        <img
                            src={track.imageUrl}
                            alt={track.trackName}
                            style={{ width: "60px", height: "60px", marginRight: "15px", objectFit: "cover" }}
                        />
                        <ListItemText
                            primary={track.trackName}
                            secondary={`${track.artists.toString()} (${track.albumName})`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SearchBar;