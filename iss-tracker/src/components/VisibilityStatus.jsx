// src/components/VisibilityStatus.jsx
import React from 'react';

const VisibilityStatus = ({ isVisible }) => {
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
            Look up! You might see it!
          </div>
        )}
      </div>

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
          Look for a bright, fast-moving star traveling west to east.
        </p>
      </div>

      {/* Elevation Interpretation Guide */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        borderLeft: '4px solid #3498db'
      }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Elevation Guide:</h3>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p><strong>0°:</strong> On the horizon</p>
          <p><strong>5°:</strong> Minimum for potential visibility</p>
          <p><strong>30°:</strong> About 1/3 of the way up the sky</p>
          <p><strong>60°:</strong> About 2/3 of the way up the sky</p>
          <p><strong>75°+:</strong> Very high in the sky</p>
          <p><strong>90°:</strong> Directly overhead (zenith)</p>
        </div>
        <p style={{ 
          fontSize: '0.8rem', 
          color: '#7f8c8d', 
          fontStyle: 'italic',
          marginTop: '10px'
        }}>
          Higher elevation generally means better visibility!
        </p>
      </div>
    </div>
  );
};

export default VisibilityStatus;