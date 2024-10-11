// pages/dashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import DonutChart from '../components/DonutChart'; // Ensure DonutChart is correctly implemented

const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      // Fetch all students to get attendance and absent counts
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
    fetchAttendanceData(); // Fetch data when component loads
  }, []);

  // Calculate percentages for present and absent students
  const presentPercentage = attendanceData.totalStudents > 0
    ? ((attendanceData.totalPresent / attendanceData.totalStudents) * 100).toFixed(2)
    : 0;

  const absentPercentage = attendanceData.totalStudents > 0
    ? ((attendanceData.totalAbsent / attendanceData.totalStudents) * 100).toFixed(2)
    : 0;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Typography variant="h4">Dashboard</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={4}
        flexDirection={{ xs: 'column', md: 'row' }} // Stacks vertically on small screens and horizontally on medium+ screens
      >
        {loading ? (
          <CircularProgress size={48} />
        ) : (
          <>
            {/* Donut Chart with calculated data */}
            <Box mr={{ xs: 0, md: 8 }} mb={{ xs: 4, md: 0 }}> {/* Margin right on medium+ screens, margin bottom on small screens */}
              <DonutChart
                data={[
                  { label: 'Present', value: attendanceData.totalPresent },
                  { label: 'Absent', value: attendanceData.totalAbsent },
                ]}
              />
            </Box>

            {/* Attendance Analytics Box with extra margin to the left */}
            <Box ml={{ xs: 0, md: 8 }}> {/* Margin left on medium+ screens */}
              <Typography variant="h4">Attendance Analytics</Typography>
              <Typography variant="h6" mb={2}>
                {attendanceData.totalPresent}/{attendanceData.totalStudents} Students Present
              </Typography>
              <Typography variant="h6" mb={1}>
                {presentPercentage}% of Students Present
              </Typography>
              <Typography variant="h6">
                {absentPercentage}% of Students Absent
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
