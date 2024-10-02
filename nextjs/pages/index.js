import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import DonutChart from '../components/DonutChart';

const Home = () => {
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Typography variant="h5">Date: 2023/03/15</Typography>
        <Button variant="contained">Overview</Button>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <DonutChart />
        <Box ml={4}>
          <Typography variant="h4">Attention analytics</Typography>
          <Typography variant="h6">3/4 Student present</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

