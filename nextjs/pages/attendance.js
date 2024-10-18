import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
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

// Styled Table components
const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#000000', // Set font color to black
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main, // Green background for table header
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.primary.light, // Light green for even rows
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // Darker green on hover
  },
}));

const Attendance = () => {
  const [date, setDate] = useState('2023-03-15'); // Default date for testing
  const [attendanceID, setAttendanceID] = useState(null); // Store the attendanceID
  const [loading, setLoading] = useState(false); // Loading state for generate button
  const [students, setStudents] = useState([]); // List of students linked to the attendance
  const [attendanceLinks, setAttendanceLinks] = useState([]); // Attendance link data
  const [showData, setShowData] = useState(false); // State to control data table visibility

  // Function to handle the Generate Sheet button click
  const generateSheet = async () => {
    setLoading(true); // Set loading to true when generating
    try {
      console.log('Generating sheet for date:', date);

      // Step 1: Create or get the attendance record for the given date
      const attendanceResponse = await axios.post('http://localhost:8000/api/attendance', { Date: date });
      const attendanceID = parseInt(attendanceResponse.data.attendanceID, 10); // Parse to ensure integer type
      setAttendanceID(attendanceID); // Store the attendance ID in state
      console.log('Attendance record created/fetched successfully:', attendanceID);

      // Step 2: Create links for all students for the given attendance ID with default status as absent
      await axios.post(`http://localhost:8000/api/attendance/link/${attendanceID}`);
      console.log('Attendance links created for students.');

      // Step 3: Fetch all students linked to this attendance record to display in the table
      const studentsResponse = await axios.get('http://localhost:8000/api/sstudents'); // Get all students
      const students = studentsResponse.data;

      // Step 4: Set all students as absent by default and increment absent count
      for (const student of students) {
        await axios.post('http://localhost:8000/api/attendance/link', {
          studentid: student.studentid,
          attendanceid: attendanceID,
          attendancecheck: false, // Set initial attendance as absent (false)
        });
      }

      setStudents(students); // Update the students state with the fetched students
      setLoading(false); // Set loading to false after successful completion
    } catch (error) {
      console.error('Error generating attendance sheet:', error.message);
      console.error('Error details:', error.response ? error.response.data : 'No response from server');
      setLoading(false); // Set loading to false if there's an error
    }
  };

  // Function to handle attendance check change
  const handleAttendanceCheckChange = async (studentID, newCheckStatus) => {
    try {
      console.log(`Updating attendance check for student ID: ${studentID} to ${newCheckStatus}`);

      // Update the attendance status for the student
      await axios.post('http://localhost:8000/api/attendance/link', {
        studentid: studentID,
        attendanceid: attendanceID, // Ensure the correct attendanceID is passed
        attendancecheck: newCheckStatus, // Update attendance status
      });

      // Update the attendance links to reflect changes
      const updatedLinksResponse = await axios.get(`http://localhost:8000/api/attendance/link/check`, {
        params: { attendanceid: attendanceID },
      });

      if (Array.isArray(updatedLinksResponse.data.links)) {
        setAttendanceLinks(updatedLinksResponse.data.links); // Update attendance links in state
      }
    } catch (error) {
      console.error('Error updating attendance link:', error.message);
    }
  };

  // Function to show the attendance table
  const showAttendanceTable = async () => {
    setLoading(true);
    try {
      // Fetch the attendance record for the selected date
      const attendanceResponse = await axios.get(`http://localhost:8000/api/attendance/by-date`, {
        params: { date },
      });

      const attendanceID = parseInt(attendanceResponse.data.attendance.attendanceid, 10); // Parse to ensure integer type
      setAttendanceID(attendanceID);
      console.log('Fetched attendance ID:', attendanceID);

      // Fetch the attendance links for this attendance record
      const linksResponse = await axios.get(`http://localhost:8000/api/attendance/link/check`, {
        params: { attendanceid: attendanceID },
      });

      if (Array.isArray(linksResponse.data.links)) {
        setAttendanceLinks(linksResponse.data.links); // Set the attendance links in state
      }

      setShowData(true);
      setLoading(false);
    } catch (error) {
      console.error('Error showing attendance table:', error.message);
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* Header and controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
          <Typography variant="h4">Attendance</Typography>
          <Box display="flex" alignItems="center">
            <TextField
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <Button variant="contained" onClick={generateSheet} disabled={loading} style={{ marginRight: '10px' }}>
              {loading ? <CircularProgress size={24} /> : 'Generate Sheet'}
            </Button>
            <Button variant="contained" color="primary" onClick={showAttendanceTable} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Show Data'}
            </Button>
          </Box>
        </Box>

        {/* Attendance Table */}
        <Box mt={4}>
          {showData && (
            <StyledTable>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Student ID</StyledTableCell>
                  <StyledTableCell>Student Name</StyledTableCell>
                  <StyledTableCell>Attendance Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => {
                  const link = attendanceLinks.find((link) => link.studentid === student.studentid);
                  const attendanceStatus = link ? link.attendancecheck : false; // Default to false if no link is found

                  return (
                    <StyledTableRow key={index}>
                      <TableCell>{student.studentid}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        {attendanceStatus ? 'Present' : 'Absent'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAttendanceCheckChange(student.studentid, true)}
                        >
                          Present
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleAttendanceCheckChange(student.studentid, false)}
                          style={{ marginLeft: '10px' }}
                        >
                          Absent
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </StyledTable>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Attendance;
