import React from 'react';
import AzimuthGuide from './AzimuthGuide';
import ElevationGuide from './ElevationGuide'; 
import { getSimpleDirection, getArrowIcon } from '../utils/directionUtils';
import CurrentElevation from './CurrentElevation';
import './VisibilityStatus.css';

const VisibilityStatus = ({ isVisible, issPosition, elevation }) => {
  const direction = getSimpleDirection(issPosition?.azimuth);
  const arrowIcon = getArrowIcon(issPosition?.azimuth);
  const azimuthValue = issPosition?.azimuth?.toFixed(1);

  // Visibility information
  const visibilityInfo = isVisible 
    ? {
        title: '🔭 ISS IS VISIBLE NOW!',
        subtitle: `Look ${direction}! ${arrowIcon} You might see it!`,
        bgColor: '#d5f4e6',
        color: '#27ae60'
      }
    : {
        title: '🌌 ISS Not Currently Visible',
        subtitle: 'Wait for the next pass to see the International Space Station',
        bgColor: '#fadbd8',
        color: '#e74c3c'
      };

  // Quick stats data
  const stats = [
    {
      icon: '📊',
      label: 'Current Elevation',
      value: `${elevation.toFixed(1)}°`
    },
    ...(issPosition?.azimuth ? [{
      icon: '🧭',
      label: 'Direction',
      value: `${direction} ${arrowIcon}`
    }] : []),
    {
      icon: '👀',
      label: 'Visibility',
      value: isVisible ? 'Visible' : 'Not Visible'
    }
  ];

  // Viewing tips (only shown when visible)
  const viewingTips = isVisible ? [
    { icon: '🌑', text: 'Find a dark location away from city lights' },
    { icon: '👀', text: 'No telescope needed - visible to naked eye' },
    { icon: '⏱️', text: 'Typically visible for 2-6 minutes' },
    { icon: '📱', text: 'Use the direction guide to know where to look' }
  ] : [];

  return (
    <div className="visibility-status-card">
      <h2>Visibility Status</h2>
      
      {/* Main visibility indicator */}
      <div 
        className="visibility-banner"
        style={{
          backgroundColor: visibilityInfo.bgColor,
          color: visibilityInfo.color
        }}
      >
        <div className="visibility-title">{visibilityInfo.title}</div>
        <div className="visibility-subtitle">{visibilityInfo.subtitle}</div>
        
        {isVisible && azimuthValue && (
          <div className="azimuth-detail">
            Azimuth: {azimuthValue}° {arrowIcon}
          </div>
        )}
      </div>

      {/* Current Elevation
      <CurrentElevation 
        elevation={elevation} 
        azimuth={issPosition?.azimuth} 
      /> */}

      {/* Quick Stats */}
      <div className="quick-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Educational Content */}
      <div className="educational-content">
        <h3>About ISS Visibility</h3>
        <p>
          The International Space Station is visible when it's <strong>more than 5° above the horizon </strong> 
          and reflects sunlight while your location is in darkness.
        </p>
        <ul>
          <li>🛰️ Orbits at 400 km altitude</li>
          <li>⚡ Travels at 27,600 km/h</li>
          <li>🌍 Circles Earth every 90 minutes</li>
          <li>✨ Appears as a bright, fast-moving star</li>
        </ul>
      </div>

      {/* Guides */}
      <div className="guides-container">
        <ElevationGuide currentElevation={elevation} />
        <AzimuthGuide azimuth={issPosition?.azimuth} />
      </div>

      {/* Viewing Tips */}
      {viewingTips.length > 0 && (
        <div className="viewing-tips">
          <h3>🔭 Viewing Tips</h3>
          <div className="tips-grid">
            {viewingTips.map((tip, index) => (
              <div key={index} className="tip">
                <span className="tip-icon">{tip.icon}</span>
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisibilityStatus;