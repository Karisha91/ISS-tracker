// src/components/ElevationGuide.jsx
import React from 'react';

const ElevationGuide = ({ currentElevation }) => {
  // Function to determine which elevation range is active
  const getElevationStatus = () => {
    if (currentElevation < 5) return 0;
    if (currentElevation < 30) return 5;
    if (currentElevation < 60) return 30;
    if (currentElevation < 75) return 60;
    if (currentElevation < 90) return 75;
    return 90;
  };

  const activeElevation = getElevationStatus();

  // Function to highlight the active elevation
  const getElevationStyle = (value) => {
    const isActive = activeElevation === value;
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      color: isActive ? '#e74c3c' : 'inherit',
      backgroundColor: isActive ? '#fff3cd' : 'transparent',
      padding: isActive ? '2px 5px' : '0',
      borderRadius: isActive ? '4px' : '0'
    };
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      borderLeft: '4px solid #3498db'
    }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Elevation Guide:</h3>
      <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
        <p><strong style={getElevationStyle(0)}>0°:</strong> On the horizon</p>
        <p><strong style={getElevationStyle(5)}>5°:</strong> Minimum for potential visibility</p>
        <p><strong style={getElevationStyle(30)}>30°:</strong> About 1/3 of the way up the sky</p>
        <p><strong style={getElevationStyle(60)}>60°:</strong> About 2/3 of the way up the sky</p>
        <p><strong style={getElevationStyle(75)}>75°+:</strong> Very high in the sky</p>
        <p><strong style={getElevationStyle(90)}>90°:</strong> Directly overhead (zenith)</p>
      </div>
      <p style={{ 
        fontSize: '0.8rem', 
        color: '#7f8c8d', 
        fontStyle: 'italic',
        marginTop: '10px'
      }}>
        Higher elevation generally means better visibility!
      </p>
      
      {/* Current elevation indicator */}
      {currentElevation !== undefined && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '5px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            Current elevation: <span style={{ color: '#2980b9' }}>{currentElevation.toFixed(1)}°</span>
          </p>
          <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', fontSize: '0.8rem' }}>
            {activeElevation === 0 && "On the horizon"}
            {activeElevation === 5 && "Minimum visibility height"}
            {activeElevation === 30 && "About 1/3 up the sky"}
            {activeElevation === 60 && "About 2/3 up the sky"}
            {activeElevation === 75 && "Very high in the sky"}
            {activeElevation === 90 && "Directly overhead!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ElevationGuide;