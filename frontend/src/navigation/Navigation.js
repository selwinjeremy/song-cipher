import { Grid2, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Spotify-themed styling
const cardStyles = {
    backgroundColor: '#191414', // Spotify dark background
    boxShadow: 3, // Slight shadow for depth
    borderRadius: '12px', // Rounded corners for smoothness
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effects
    '&:hover': {
        transform: 'translateY(-10px)', // Lift card on hover
        boxShadow: 6, // Stronger shadow on hover
    },
};

const titleStyles = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1DB954', // Spotify green for the title
    textAlign: 'center',
};

const descriptionStyles = {
    fontSize: '1.1rem',
    color: '#B3B3B3', // Lighter gray for text to keep the focus on the title
    textAlign: 'center',
    marginBottom: '20px', // Space between description and button
};

const buttonStyles = {
    backgroundColor: '#1DB954', // Spotify green for buttons
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: '#1ED760', // Slightly brighter green on hover
    },
};

const GridContainer = () => {
    const navigate = useNavigate();

    return (
        <Grid2 container spacing={4} justifyContent="center">
            <Grid2 item xs={12} sm={6} md={4}>
                <Card sx={cardStyles}>
                    <CardContent>
                        <Typography variant="h4" sx={titleStyles}>
                            Hip Hop Challenge
                        </Typography>
                        <Typography variant="body1" sx={descriptionStyles}>
                            Guess the mainstream hip hop song based on the clues.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={buttonStyles}
                            fullWidth
                            onClick={() => navigate('/hip-hop-challenge')}
                        >
                            Start Challenge
                        </Button>
                    </CardContent>
                </Card>
            </Grid2>

            <Grid2 item xs={12} sm={6} md={4}>
                <Card sx={cardStyles}>
                    <CardContent>
                        <Typography variant="h4" sx={titleStyles}>
                            Pop Challenge
                        </Typography>
                        <Typography variant="body1" sx={descriptionStyles}>
                            Guess the mainstream pop song based on the clues.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={buttonStyles}
                            fullWidth
                            onClick={() => navigate('/pop-challenge')}
                        >
                            Start Challenge
                        </Button>
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
    );
};

export default GridContainer;