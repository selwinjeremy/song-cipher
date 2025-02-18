import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Tooltip } from "@mui/material";
import { ArrowUpward, ArrowDownward, InfoOutlined } from "@mui/icons-material";

const GuessesTable = ({ guesses }) => {

  const columnHeaders = [
    { name: "Name", helpText: <>Red: Incorrect Song Name <br /> Green: Correct Song Name</> },
    { name: "Artists", helpText: <>Red: No Correct Artists <br /> Yellow: Atleast 1 Correct Artist <br /> Green: Correct Artists</> },
    { name: "Album", helpText: <>Red: Incorrect Album Name <br /> Green: Correct Album Name</> },
    { name: "Released On", helpText: <>Red: Year is off by atleast 2 Years <br /> Yellow: Year is off by 1 Year <br /> Green: Correct Year <br /> Up Arrow: The Song to Guess is more recent <br /> Down Arrow: The Song to Guess is older</> },
    { name: "Song Length", helpText: <>Red: Song Length is off by atleast 30 seconds <br /> Yellow: Song Length is less than 30 seconds off <br /> Green: Correct Song Length <br /> Up Arrow: The Song to Guess is longer <br /> Down Arrow: The Song to Guess is shorter</> },
    { name: "Popularity", helpText: <>Red: Popularity is off by more than 10 points <br /> Yellow: Popularity is less than 10 points off <br /> Green: Correct Popularity Score <br /> Up Arrow: The Song to Guess is more popular <br /> Down Arrow: The Song to Guess less popular</> },
  ];

  return (
    <Box
      style={{
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#121212", // Spotify Dark Mode
        color: "#fff", // White text
        borderRadius: "8px",
      }}
    >
      <TableContainer component={Paper} style={{ backgroundColor: "#181818", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)" }}>
        <Table>
          {/* ---- Table Header ---- */}
          <TableHead>
            <TableRow style={{ backgroundColor: "#282828" }}>
              {columnHeaders.map(({ name, helpText }) => (
                <TableCell key={name} style={{ color: "#B3B3B3", fontWeight: "bold", fontSize: "14px", padding: "14px" }}>
                  {name}
                  <Tooltip title={helpText} arrow>
                    <InfoOutlined fontSize="small" style={{ marginLeft: 5, cursor: "pointer", color: "#B3B3B3" }} />
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ---- Table Body ---- */}
          <TableBody>
            {guesses?.map((guess, index) => (
              <TableRow key={index} style={{ borderBottom: "1px solid #282828", transition: "0.2s ease-in-out" }}>
                {["Name", "Artists", "Album", "Released", "Length", "Popularity"].map((field) => {
                  const data = guess[field];
                  const borderColor = data?.Colour || "#FFF"; // Use text color for the border

                  return (
                    <TableCell key={field} style={{ padding: "12px", border: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px",
                          borderRadius: "8px",
                          backgroundColor: "#181818", // Dark Spotify Theme
                          border: `2px solid ${borderColor}`, // Dynamic border color
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                          // Apply stronger glow for red and yellow
                          boxShadow: borderColor === "red" // Red
                            ? `0px 6px 10px rgba(226, 33, 52, 0.6)`
                            : borderColor === "yellow" // Yellow
                              ? `0px 6px 10px rgba(255, 193, 7, 0.6)`
                              : `0px 6px 10px ${borderColor}66`, // Default for other colors
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: field === "Name" ? "bold" : "500",
                            fontSize: "15px",
                          }}
                        >
                          {data?.Text || ""}
                          {data?.Icon === "up" && <ArrowUpward sx={{ marginLeft: 1, fontSize: 15, color: "#1DB954" }} />}
                          {data?.Icon === "down" && <ArrowDownward sx={{ marginLeft: 1, fontSize: 15, color: "#E22134" }} />}
                        </Typography>
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GuessesTable;