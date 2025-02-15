require("dotenv").config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = process.env.PORT || 5000;

const redirect_uri = `${process.env.API_URI}/callback`; // Redirect after login
const frontend_uri = `${process.env.FRONT_END_URI}`; // React app URL

let accessToken = null;
let refreshToken = null;
let tokenExpiresAt = 0;

// Enable CORS
app.use(cors());

app.get('/', (req, res) => res.send('Welcome to Song Cipher'))

// Redirect user to Spotify login
app.get("/login", (req, res) => {
    const scope = "playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public";
    const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri
    })}`;
    res.redirect(authURL);
});

// Handle Spotify callback and exchange code for tokens
app.get("/callback", async (req, res) => {
    const code = req.query.code || null;

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", 
            querystring.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirect_uri,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            }), 
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

        // Redirect to frontend with access token
        res.redirect(`${frontend_uri}/?access_token=${accessToken}`);
    } catch (error) {
        console.error("Error during authentication:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to authenticate with Spotify" });
    }
});

// Refresh token function
const refreshAccessToken = async () => {
    if (!refreshToken) return null;
    try {
        const response = await axios.post("https://accounts.spotify.com/api/token",
            querystring.stringify({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        accessToken = response.data.access_token;
        tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
        return accessToken;
    } catch (error) {
        console.error("Failed to refresh token:", error.response?.data || error.message);
        return null;
    }
};

// Ensure we always have a valid token
const getAccessToken = async () => {
    if (Date.now() >= tokenExpiresAt) {
        return await refreshAccessToken();
    }
    return accessToken;
};

//Fetch songs from search
app.get("/search", async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")[1]; // Extract token from headers
    const query = req.query.query; // Extract search query from request params

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing access token" });
    }

    if (!query) {
        return res.status(400).json({ error: "Missing query parameter" });
    }

    try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: query, type: "track", limit: 10 },
        });

        res.json(response.data.tracks); // Return only the tracks

    } catch (error) {
        console.error("Spotify search error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch songs" });
    }
});

// Fetch song by id
app.get("/song", async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")[1]; // Extract token from headers
    const songId = req.query.songId;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing access token" });
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching playlists:", error.response?.data || error.message);
        res.status(error.response?.status).json({ error: "Failed to fetch playlists" });
    }
});

app.get("/playlists", async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing access token" });
    }
    try {
        const response = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching playlists:", error.response?.data || error.message);
        res.status(error.response?.status).json({ error: "Failed to fetch playlists" });
    }
})

// Fetch playlists
app.get("/playlistSong", async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")[1]; // Extract token from headers
    const genre = req.query.genre;
    let genreSelected = 'pop'
    switch (genre){
        case 'hiphop':
            genreSelected = process.env.HIP_HOP_PLAYLIST_ID
            break;
        case 'pop':
            genreSelected = process.env.POP_PLAYLIST_ID
            break;
    }

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing access token" });
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${genreSelected}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const randomTrack = getRandomTrack(response.data.tracks['items'])
        res.json(randomTrack);
    } catch (error) {
        console.error("Error fetching playlists:", error.response?.data || error.message);
        res.status(error.response?.status).json({ error: "Failed to fetch playlists" });
    }
});

app.get("/userPlaylistSong", async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")[1]; // Extract token from headers
    const playlistId = req.query.id;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing access token" });
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const randomTrack = getRandomTrack(response.data.tracks['items'])
        res.json(randomTrack);
    } catch (error) {
        console.error("Error fetching playlists:", error.response?.data || error.message);
        res.status(error.response?.status).json({ error: "Failed to fetch playlists" });
    }
});

const getRandomTrack = (tracks) => {
    if (!Array.isArray(tracks) || tracks.length === 0) {
        return null; // Handle empty or invalid input
    }

    const randomIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomIndex];
};


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
