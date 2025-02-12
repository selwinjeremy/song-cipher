import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material';

const GuessesTable = ({ guesses, loading }) => {
  return (
    <Box style={{ width: "100%", padding: "20px", boxSizing: 'border-box' }}>
      {/* Show a loading spinner when data is loading */}
      {loading && <CircularProgress size={24} style={{ marginTop: "10px" }} />}
      
      {/* Table container styled to match the SearchBar section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Album</TableCell>
              <TableCell>Released</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Popularity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guesses?.map((guess, index) => (
              <TableRow key={index}>
                <TableCell>{guess.name}</TableCell>
                <TableCell>{guess.artist}</TableCell>
                <TableCell>{guess.album}</TableCell>
                <TableCell>{guess.released}</TableCell>
                <TableCell>{guess.length}</TableCell>
                <TableCell>{guess.popularity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GuessesTable;