// import React from 'react';
// import { Container, Box, Typography, Button } from '@mui/material';
// import AttendanceTable from '../components/AttendanceTable';

// const Attendance = () => {
//   return (
//     <Container>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
//             <div style={{ marginBottom: '20px' }}>
//                 <label htmlFor="date">Date: </label>
//                 <input type="date" id="date" defaultValue="2023-03-15" style={{ marginRight: '10px' }} />
//                 <button>Generate Sheet</button>
//             </div>
        
//         <Button variant="contained">Generate Sheet</Button>
//       </Box>
//       <Box mt={4}>
//         <Typography variant="h4">Attendance</Typography>
//         <AttendanceTable />
//       </Box>
//     </Container>
//   );
// };

// export default Attendance;

import React from "react";
import StudentManagement from "../components/StudentManagement";

export default function AddAttendance() {
  return (
    <div>
      <h1>Add Attendance Page</h1>
      <StudentManagement />
    </div>
  );
}