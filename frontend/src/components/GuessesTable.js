import React from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const GuessesTable = ({ guesses }) => {
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
              {["Name", "Artists", "Album", "Released On", "Song Length", "Popularity"].map((header) => (
                <TableCell key={header} style={{ color: "#B3B3B3", fontWeight: "bold", fontSize: "14px", padding: "14px" }}>
                  {header}
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

                  return (
                    <TableCell key={field} style={{ padding: "12px 16px", fontSize: "15px", fontWeight: field === "Name" ? "bold" : "normal", color: data?.Colour || "#FFF" }}>
                      <Typography variant="body2" style={{ display: "flex", alignItems: "center", fontWeight: field === "Name" ? "bold" : "500", fontSize: "15px" }}>
                        {data?.Text || ""}
                        {data?.Icon === "up" && <ArrowUpward style={{ marginLeft: 6, fontSize: 18, color: "#1DB954" }} />}
                        {data?.Icon === "down" && <ArrowDownward style={{ marginLeft: 6, fontSize: 18, color: "#E22134" }} />}
                      </Typography>
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