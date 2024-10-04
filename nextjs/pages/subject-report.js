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


// nextjs/pages/subject-report.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubjectReport = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/sstudents');
        console.log("API Response:", response.data); // Log the response to check the structure
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students. Please check the server or network connection.");
      }
    };
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Subject Report</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Student Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Total Present Day</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Total Absence Day</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.studentid}</td> {/* Adjusted to lowercase `studentid` */}
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.attendancecount}</td> {/* Adjusted to lowercase `attendancecount` */}
                <td style={{ border: '1px solid black', padding: '8px' }}>{student.absentcount}</td> {/* Adjusted to lowercase `absentcount` */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '8px' }}>No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectReport;
