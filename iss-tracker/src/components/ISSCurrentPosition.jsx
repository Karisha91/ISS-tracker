import React from 'react';

const ISSCurrentPosition = ({ issPosition, issTle, formatTimestamp, observerLocation, realElevation }) => {
  // Check if we have valid data
  const hasValidPosition = issPosition &&
    typeof issPosition.latitude === 'number' &&
    typeof issPosition.longitude === 'number';

  // Convert km/s to more understandable units
  const velocityKmS = 7.66; // ISS orbital velocity
  const velocityKmH = velocityKmS * 3600; // Convert to km/h
  const velocityMph = velocityKmH * 0.621371; // Convert to mph

  return (
    <div>
      <h2>🛰️ Current Position</h2>
      
      <div>
        <h3>📡 Satellite Info</h3>
        <p>
          <span>🛸</span>
          <strong>Satellite:</strong> {issTle?.info?.satname || 'SPACE STATION'} (NORAD: {issTle?.info?.satid || 25544})
        </p>
      </div>

      <div>
        <h3>📍 Position</h3>
        <p>
          <span>🌐</span>
          <strong>Latitude:</strong> {hasValidPosition ? issPosition.latitude.toFixed(6) : 'N/A'}°
        </p>
        <p>
          <span>🌐</span>
          <strong>Longitude:</strong> {hasValidPosition ? issPosition.longitude.toFixed(6) : 'N/A'}°
        </p>
        <p>
          <span>📏</span>
          <strong>Altitude:</strong> {issPosition?.altitude ? issPosition.altitude.toFixed(2) : 'N/A'} km
        </p>
      </div>

      <div>
        <h3>⏱️ Time & Observation</h3>
        <p>
          <span>🕒</span>
          <strong>Time:</strong> {issPosition?.timestamp ? formatTimestamp(issPosition.timestamp) : 'N/A'}
        </p>
        <p>
          <span>📐</span>
          <strong>Elevation:</strong> {realElevation.toFixed(2)}°
        </p>
        {issPosition?.azimuth && (
          <p>
            <span>🧭</span>
            <strong>Azimuth:</strong> {issPosition.azimuth.toFixed(2)}°
          </p>
        )}
      </div>

      <div>
        <h3>⚡ Velocity</h3>
        <p>
          <span>🚀</span>
          <strong>Velocity:</strong> {velocityKmS.toFixed(2)} km/s
        </p>
        <p>
          <span>💨</span>
          <strong>Speed:</strong> {velocityKmH.toFixed(0)} km/h ({velocityMph.toFixed(0)} mph)
        </p>
      </div>

      {/* Educational Content */}
      <div>
        <h3>🔭 About ISS Visibility</h3>
        <p>
          The International Space Station is visible when it's <strong>more than 5° above the horizon</strong> 
          and reflects sunlight while your location is in darkness.
        </p>
        <ul>
          <li>🛰️ Orbits at 400 km altitude</li>
          <li>⚡ Travels at 27,600 km/h</li>
          <li>🌍 Circles Earth every 90 minutes</li>
          <li>✨ Appears as a bright, fast-moving star</li>
        </ul>
      </div>
    </div>
  );
};

export default ISSCurrentPosition;