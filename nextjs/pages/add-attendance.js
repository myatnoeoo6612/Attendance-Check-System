import React, { useState } from 'react';
import { Box, TextField, Button, Container, Typography } from '@mui/material';

const AddAttendanceForm = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Submitted:', { name, id });
  };

  const handleReset = () => {
    setName('');
    setId('');
  };

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={2}>Add a Attendance</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Full name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="ID"
            variant="outlined"
            fullWidth
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="eg. 6011750"
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained">Submit</Button>
          <Button type="button" variant="outlined" onClick={handleReset}>Reset</Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddAttendanceForm;
