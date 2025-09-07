// src/components/CurrentElevation.jsx
import React from 'react';
import { getSimpleDirection, getArrowIcon } from '../utils/directionUtils';

const CurrentElevation = ({ elevation, azimuth }) => {
  return (
    <div style={{ 
      textAlign: 'center',
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#e8f4f8',
      borderRadius: '8px'
    }}>
      <h3 style={{ marginTop: 0 }}>Current Elevation</h3>
      <p style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold',
        color: '#2980b9',
        margin: '5px 0'
      }}>
        {elevation ? elevation.toFixed(1) + '°' : 'N/A'}
      </p>
      {azimuth && (
        <div style={{
          fontSize: '1rem',
          marginTop: '5px',
          color: '#2c3e50'
        }}>
          Direction: {getSimpleDirection(azimuth)} {getArrowIcon(azimuth)}
        </div>
      )}
    </div>
  );
};

export default CurrentElevation;