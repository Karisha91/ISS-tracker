import React from 'react';
import { getSimpleDirection, getArrowIcon } from '../utils/directionUtils';

const AzimuthGuide = ({ azimuth }) => {
  // Handle different data types and edge cases
  if (azimuth === undefined || azimuth === null) {
    return null;
  }
  
  // Convert to number if it's a string
  const numericAzimuth = typeof azimuth === 'string' ? parseFloat(azimuth) : azimuth;
  
  if (isNaN(numericAzimuth)) {
    return null;
  }

  const direction = getSimpleDirection(numericAzimuth);
  const arrow = getArrowIcon(numericAzimuth);

  return (
    <div style={{
      backgroundColor: '#f0f7ff',
      padding: '15px',
      borderRadius: '8px',
      borderLeft: '4px solid #2980b9',
      marginTop: '15px'
    }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Direction Guide:</h3>
      
      <div style={{ fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'center' }}>
        <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>
          {arrow} Look {direction}
        </p>
        <p>
          <strong>Azimuth: {numericAzimuth.toFixed(1)}°</strong><br />
          (0° = North, 90° = East, 180° = South, 270° = West)
        </p>
        
        {/* Additional compass explanation */}
        <div style={{ 
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '5px',
          fontSize: '0.8rem'
        }}>
          <p style={{ margin: '5px 0' }}>
            <strong>🔭 Viewing Tip:</strong> Face {direction} and look up at {numericAzimuth.toFixed(1)}° azimuth
          </p>
          <p style={{ margin: '5px 0', fontStyle: 'italic' }}>
            The ISS orbits west to east, but appears in different parts of the sky during its pass
          </p>
        </div>
      </div>
    </div>
  );
};

export default AzimuthGuide;