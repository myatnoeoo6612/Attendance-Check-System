// nextjs/pages/subject-report.js
import React from 'react';

const SubjectReport = () => {
    const rows = [
        { name: 'Pari', id: '6601150', present: 13, absence: 2 },
        { name: 'Fern', id: '6602150', present: 2, absence: 10 },
        { name: 'Iminpain', id: '6602350', present: 3, absence: 50 },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Subject Report</h1>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="date">Date: </label>
                <input type="date" id="date" defaultValue="2023-03-15" style={{ marginRight: '10px' }} />
                <button>Generate Sheet</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Student name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Present Day</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Absence Day</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{row.name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{row.id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{row.present}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{row.absence}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectReport;
