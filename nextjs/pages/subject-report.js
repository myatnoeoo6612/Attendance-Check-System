import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

// Custom theme to match the Dashboard
const theme = createTheme({
  palette: {
    primary: {
      main: '#66BB6A', // Light green primary color (matching Dashboard)
    },
    secondary: {
      main: '#D81B60', // Secondary accent color
    },
    background: {
      default: '#F1F8E9', // Light green background
    },
    text: {
      primary: '#2E7D32', // Dark green text color
      secondary: '#558B2F', // Lighter green for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2E7D32',
    },
    h6: {
      fontSize: '1.2rem',
      color: '#558B2F',
    },
  },
});

// Styled components for the table
const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'collapse',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid black',
  padding: '8px',
  color: '#000000', // Explicitly set font color to black
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.primary.light, // Light green for even rows
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // Darker green on hover
  },
}));

const SubjectReport = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/sstudents');
        console.log("API Response:", response.data); // Log the response to check the structure
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students. Please check the server or network connection.");
      }
    };
    fetchStudents();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box mt={4} mb={4}>
          <Typography variant="h4" align="center">Report</Typography> {/* Changed to "Report" */}
        </Box>

        {error && <Typography color="error" align="center">{error}</Typography>}

        <Paper elevation={3} sx={{ padding: 2 }}>
          <StyledTable>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Total Present Day</StyledTableCell>
                <StyledTableCell>Total Absence Day</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <StyledTableRow key={index}>
                    <TableCell style={{ color: '#000000' }}>{student.name}</TableCell> {/* Black font */}
                    <TableCell style={{ color: '#000000' }}>{student.studentid}</TableCell> {/* Black font */}
                    <TableCell style={{ color: '#000000' }}>{student.attendancecount}</TableCell> {/* Black font */}
                    <TableCell style={{ color: '#000000' }}>{student.absentcount}</TableCell> {/* Black font */}
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" style={{ padding: '8px', color: '#000000' }}>
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default SubjectReport;
