// components/DonutChart.js
import React from 'react';
import PropTypes from 'prop-types';

const DonutChart = ({ data }) => {
  // Calculate the percentage of each segment
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const presentPercentage = total ? (data[0].value / total) * 100 : 0;
  const absentPercentage = total ? (data[1].value / total) * 100 : 0;

  const backgroundStyle = {
    background: `conic-gradient(
      #4CAF50 ${presentPercentage * 3.6}deg,
      #F44336 0 ${absentPercentage * 3.6 + presentPercentage * 3.6}deg,
      #e0e0e0 0
    )`,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Pie Chart Container */}
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          ...backgroundStyle, // Apply background style with conic-gradient
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Inner Circle for Donut Effect */}
        <div
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            position: 'absolute',
          }}
        ></div>
      </div>
      {/* Labels */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
          Present: {presentPercentage.toFixed(2)}%
        </div>
        <div style={{ color: '#F44336', fontWeight: 'bold' }}>
          Absent: {absentPercentage.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

// Prop types to ensure the component receives valid data
DonutChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default DonutChart;
