import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import AttendanceTable from '../components/AttendanceTable';

const Attendance = () => {
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Typography variant="h5">Date: 2023/03/15</Typography>
        <Button variant="contained">Generate Sheet</Button>
      </Box>
      <Box mt={4}>
        <Typography variant="h4">Attendance</Typography>
        <AttendanceTable />
      </Box>
    </Container>
  );
};

export default Attendance;
