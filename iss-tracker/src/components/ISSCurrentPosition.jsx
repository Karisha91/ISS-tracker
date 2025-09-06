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
    <div className="data-card">
      <h2>Current Position</h2>
      <p><strong>Satellite:</strong> {issTle?.info?.satname || 'SPACE STATION'} (NORAD: {issTle?.info?.satid || 25544})</p>
      <p><strong>Latitude:</strong> {hasValidPosition ? issPosition.latitude.toFixed(6) : 'N/A'}°</p>
      <p><strong>Longitude:</strong> {hasValidPosition ? issPosition.longitude.toFixed(6) : 'N/A'}°</p>
      <p><strong>Altitude:</strong> {issPosition?.altitude ? issPosition.altitude.toFixed(2) : 'N/A'} km</p>
      <p><strong>Time:</strong> {issPosition?.timestamp ? formatTimestamp(issPosition.timestamp) : 'N/A'}</p>

      {/* Always show the calculated elevation */}
      <p><strong>Elevation:</strong> {realElevation.toFixed(2)}°</p>
      <p><strong>Elevation from ISS:</strong> {issPosition.elevation.toFixed(2)}°</p>

      {/* Display velocity with correct units */}
      <p><strong>Velocity:</strong> {velocityKmS.toFixed(2)} km/s</p>
      <p><strong>Speed:</strong> {velocityKmH.toFixed(0)} km/h ({velocityMph.toFixed(0)} mph)</p>

      {/* Only show azimuth if it exists */}
      {issPosition?.azimuth && (
        <p><strong>Azimuth:</strong> {issPosition.azimuth.toFixed(2)}°</p>
      )}
    </div>
  );
};

export default ISSCurrentPosition;