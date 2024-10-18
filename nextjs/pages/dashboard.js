import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import DonutChart from '../components/DonutChart'; // Ensure DonutChart is correctly implemented

const theme = createTheme({
  palette: {
    background: {
      default: '#F1F8E9', // Light green background
      paper: '#FFFFFF', // White for cards and paper elements
    },
    primary: {
      main: '#66BB6A', // Soft light green for primary elements
    },
    secondary: {
      main: '#A5D6A7', // Lighter green as an accent
    },
    text: {
      primary: '#2E7D32', // Dark green for primary text
      secondary: '#558B2F', // Soft green for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700, // Larger and bold title
      color: '#2E7D32',
      fontSize: '4rem', // Increased size for title
      marginBottom: '2rem', // Spacing below title
    },
    h4: {
      fontWeight: 500,
      color: '#2E7D32', // Dark green for headers
      fontSize: '2rem', // Larger font size
    },
    h6: {
      fontWeight: 400,
      color: '#558B2F', // Subtle green for secondary text
      fontSize: '1.25rem', // Slightly larger for better readability
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Softer, larger rounded corners
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)', // Deeper shadow for more depth
          padding: '32px', // Increased padding for a larger feel
          textAlign: 'center', // Center the text for a balanced layout
        },
      },
    },
  },
});

const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      const response = await axios.get('http://localhost:8000/api/sstudents');
      const students = response.data;

      let totalPresent = 0;
      let totalAbsent = 0;

      students.forEach((student) => {
        totalPresent += student.attendancecount;
        totalAbsent += student.absentcount;
      });

      const totalStudents = totalPresent + totalAbsent;

      setAttendanceData({
        totalPresent,
        totalAbsent,
        totalStudents,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance data:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const presentPercentage = attendanceData.totalStudents > 0
    ? ((attendanceData.totalPresent / attendanceData.totalStudents) * 100).toFixed(2)
    : 0;

  const absentPercentage = attendanceData.totalStudents > 0
    ? ((attendanceData.totalAbsent / attendanceData.totalStudents) * 100).toFixed(2)
    : 0;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', padding: 4, backgroundColor: theme.palette.background.default }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h1">Attendance Dashboard</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={6} // Spacing between the boxes
        >
          {loading ? (
            <CircularProgress size={64} color="primary" />
          ) : (
            <>
              <Box>
                <Paper elevation={3}>
                  <DonutChart
                    data={[
                      { label: 'Present', value: attendanceData.totalPresent },
                      { label: 'Absent', value: attendanceData.totalAbsent },
                    ]}
                  />
                </Paper>
              </Box>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                {/* Box 1: Total Present */}
                <Paper elevation={3}>
                  <Typography variant="h4" gutterBottom>Total Present</Typography>
                  <Typography variant="h6">
                    {attendanceData.totalPresent}/{attendanceData.totalStudents} Students Present
                  </Typography>
                </Paper>
                {/* Box 2: Present Percentage */}
                <Paper elevation={3}>
                  <Typography variant="h4" gutterBottom>Present Percentage</Typography>
                  <Typography variant="h6">{presentPercentage}% of Students Present</Typography>
                </Paper>
                {/* Box 3: Absent Percentage */}
                <Paper elevation={3}>
                  <Typography variant="h4" gutterBottom>Absent Percentage</Typography>
                  <Typography variant="h6">{absentPercentage}% of Students Absent</Typography>
                </Paper>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
