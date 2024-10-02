import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const DonutChart = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <CircularProgress
        variant="determinate"
        value={75}
        size={200}
        thickness={4}
        sx={{ color: 'pink' }}
      />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Attended
      </Typography>
      <Typography variant="h4" sx={{ color: 'pink' }}>
        75%
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Absent
      </Typography>
      <Typography variant="h4" sx={{ color: 'lightpurple' }}>
        25%
      </Typography>
    </Box>
  );
};

export default DonutChart;
