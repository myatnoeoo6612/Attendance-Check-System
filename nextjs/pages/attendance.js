import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

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

  // Function to update the attendance status for each student
  const handleAttendanceCheckChange = async (studentID, newCheckStatus) => {
    try {
      console.log(`Updating attendance check for student ID: ${studentID} to ${newCheckStatus}`);

      // Create or update the attendance link for the student
      const updateResponse = await axios.post('http://localhost:8000/api/attendance/link', {
        studentid: studentID,
        attendanceid: attendanceID, // Make sure `attendanceID` is an integer
        attendancecheck: newCheckStatus,
      });
      console.log('Attendance link updated successfully:', updateResponse.data);

      // Refresh attendance links after update
      const updatedLinksResponse = await axios.get(`http://localhost:8000/api/attendance/link/check`, {
        params: { attendanceid: attendanceID } // Pass only `attendanceid` as expected by the API
      });

      if (Array.isArray(updatedLinksResponse.data.links)) {
        setAttendanceLinks(updatedLinksResponse.data.links); // Refresh the attendance links in state
      }
    } catch (error) {
      console.error('Error updating attendance link:', error.message);
      console.error('Error details:', error.response ? error.response.data : 'No response from server');
    }
  };

  // Function to show the attendance table
  const showAttendanceTable = async () => {
    setLoading(true);
    try {
      // Fetch the attendance record for the selected date
      const attendanceResponse = await axios.get(`http://localhost:8000/api/attendance/by-date`, {
        params: { date }
      });

      const attendanceID = parseInt(attendanceResponse.data.attendance.attendanceid, 10); // Parse to ensure integer type
      setAttendanceID(attendanceID);
      console.log('Fetched attendance ID:', attendanceID);

      // Log the parameter value being sent to the API
      console.log(`Sending request to /attendance/link/check with attendanceid: ${attendanceID}`);

      // Fetch the attendance links for this attendance record
      const linksResponse = await axios.get(`http://localhost:8000/api/attendance/link/check`, {
        params: { attendanceid: attendanceID } // Ensure `attendanceid` is passed correctly
      });

      console.log('Attendance links fetched successfully:', linksResponse.data);

      if (Array.isArray(linksResponse.data.links)) {
        setAttendanceLinks(linksResponse.data.links); // Set the attendance links in state
      }

      setShowData(true);
      setLoading(false);
    } catch (error) {
      console.error('Error showing attendance table:', error.message);
      console.error('Error details:', error.response ? error.response.data : 'No response from server');
      setLoading(false);
    }
  };

  // Render the UI for the attendance page
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="date">Date: </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" onClick={generateSheet} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Generate Sheet'}
          </Button>
        </div>
        <Button variant="contained" color="primary" onClick={showAttendanceTable} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Show Data'}
        </Button>
      </Box>
      <Box mt={4}>
        <Typography variant="h4">Attendance</Typography>
        {/* Display the attendance table with student data */}
        {showData && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Attendance Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => {
                const link = attendanceLinks.find((link) => link.studentid === student.studentid);
                const attendanceStatus = link ? link.attendancecheck : false; // Default to false if no link is found

                return (
                  <TableRow key={index}>
                    <TableCell>{student.studentid}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      {attendanceStatus ? 'Present' : 'Absent'}
                    </TableCell>
                    <TableCell>
                      {/* Button to set attendance status to Present */}
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAttendanceCheckChange(student.studentid, true)}
                      >
                        Present
                      </Button>
                      {/* Button to set attendance status to Absent */}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleAttendanceCheckChange(student.studentid, false)}
                        style={{ marginLeft: '10px' }}
                      >
                        Absent
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Box>
    </Container>
  );
};

export default Attendance;
