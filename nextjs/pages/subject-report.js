// // nextjs/pages/subject-report.js
// import React from 'react';

// const SubjectReport = () => {
//     const rows = [
//         { name: 'Pari', id: '6601150', present: 13, absence: 2 },
//         { name: 'Fern', id: '6602150', present: 2, absence: 10 },
//         { name: 'Iminpain', id: '6602350', present: 3, absence: 50 },
//     ];

//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>Subject Report</h1>
//             {/* <div style={{ marginBottom: '20px' }}>
//                 <label htmlFor="date">Date: </label>
//                 <input type="date" id="date" defaultValue="2023-03-15" style={{ marginRight: '10px' }} />
//                 <button>Generate Sheet</button>
//             </div> */}
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                     <tr>
//                         <th style={{ border: '1px solid black', padding: '8px' }}>Student name</th>
//                         <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
//                         <th style={{ border: '1px solid black', padding: '8px' }}>Total Present Day</th>
//                         <th style={{ border: '1px solid black', padding: '8px' }}>Total Absence Day</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {rows.map((row, index) => (
//                         <tr key={index}>
//                             <td style={{ border: '1px solid black', padding: '8px' }}>{row.name}</td>
//                             <td style={{ border: '1px solid black', padding: '8px' }}>{row.id}</td>
//                             <td style={{ border: '1px solid black', padding: '8px' }}>{row.present}</td>
//                             <td style={{ border: '1px solid black', padding: '8px' }}>{row.absence}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default SubjectReport;


import React, { useState, useEffect } from "react";
import { CircularProgress, Container, Typography, Snackbar, Alert } from "@mui/material";

const API_URL = "http://localhost:8000"; // Backend URL

const SubjectReport = () => {
  // State to hold student data
  const [students, setStudents] = useState([]);
  // State to manage loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/students`);
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setSnackbarMessage(error.message || "Failed to fetch student data");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={2} align="center">
        Subject Report
      </Typography>

      {/* Display loading indicator if data is still being fetched */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Loading...
          </Typography>
        </div>
      ) : error ? (
        <Typography variant="h6" color="error" align="center">
          Failed to load student data.
        </Typography>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>Student Name</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Total Present Day</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Total Absence Day</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{student.name}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{student.studentID}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{student.attendanceCount}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{student.absentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SubjectReport;
