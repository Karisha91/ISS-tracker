
import React from 'react';
import AzimuthGuide from './AzimuthGuide';
import ElevationGuide from './ElevationGuide'; 
import { getSimpleDirection, getArrowIcon } from '../utils/directionUtils';
import CurrentElevation from './CurrentElevation';

const VisibilityStatus = ({ isVisible, issPosition, elevation }) => {
  // Function to determine which elevation range is active
  const getElevationStatus = () => {
    if (elevation < 5) return 0;
    if (elevation < 30) return 5;
    if (elevation < 60) return 30;
    if (elevation < 75) return 60;
    if (elevation < 90) return 75;
    return 90;
  };

  const activeElevation = getElevationStatus();
  const direction = getSimpleDirection(issPosition?.azimuth);
  const arrowIcon = getArrowIcon(issPosition?.azimuth);

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

  // Get the appropriate look direction message
  const getLookDirectionMessage = () => {
    if (!issPosition?.azimuth) return 'Look up! You might see it!';
    
    return `Look ${direction}! ${arrowIcon} You might see it!`;
  };

  return (
    <div className="data-card">
      <h2>Visibility Status</h2>
      
      {/* Main visibility indicator */}
      <div style={{
        color: isVisible ? '#27ae60' : '#e74c3c',           
        fontWeight: 'bold', 
        fontSize: '1.2rem',                                
        textAlign: 'center',                               
        padding: '15px',                                   
        backgroundColor: isVisible ? '#d5f4e6' : '#fadbd8', 
        borderRadius: '8px',                               
        marginBottom: '20px'                               
      }}>
        {/* Display different message based on visibility */}
        {isVisible ? '🔭 ISS IS VISIBLE NOW!' : '🌌 ISS Not Currently Visible'}
        
        {/* Additional info if visible */}
        {isVisible && (
          <div style={{ 
            fontSize: '1rem',     
            marginTop: '8px'      
          }}>
            {getLookDirectionMessage()}
            {issPosition?.azimuth && (
              <div style={{
                fontSize: '0.8rem',
                marginTop: '5px',
                color: '#2c3e50'
              }}>
                (Azimuth: {issPosition.azimuth.toFixed(1)}°)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Use the new CurrentElevation component */}
      <CurrentElevation 
        elevation={elevation} 
        azimuth={issPosition?.azimuth} 
      />
      

      {/* Explanation of what visibility means */}
      <div style={{ 
        fontSize: '0.9rem', 
        color: '#666',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <p>
          <strong>Visibility means:</strong> ISS is more than 5° above your horizon 
          and might be visible to the naked eye.
        </p>
        <p>
          The ISS orbits west to east, but currently look {getSimpleDirection(issPosition?.azimuth)} {getArrowIcon(issPosition?.azimuth)}
        </p>
      </div>

      {/* Use the new ElevationGuide component */}
      <ElevationGuide currentElevation={elevation} />

      {/* Use the AzimuthGuide component */}
      <AzimuthGuide azimuth={issPosition?.azimuth} />
    </div>
  );
};

export default VisibilityStatus;