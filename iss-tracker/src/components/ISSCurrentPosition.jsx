
import React from 'react';

const ISSCurrentPosition = ({ issPosition, issTle, formatTimestamp }) => {
  return (
    <div className="data-card">
      <h2>Current Position</h2>
      <p><strong>Satellite:</strong> {issTle.info.satname || 'SPACE STATION'} (NORAD: {issTle.info.satid || 25544})</p>
      <p><strong>Latitude:</strong> {issPosition.latitude.toFixed(6)}°</p>
      <p><strong>Longitude:</strong> {issPosition.longitude.toFixed(6)}°</p>
      <p><strong>Altitude:</strong> {issPosition.altitude?.toFixed(2) || '0'} km</p>
      <p><strong>Time:</strong> {formatTimestamp(issPosition.timestamp)}</p>
      {issPosition.azimuth && (
        <>
          <p><strong>Azimuth:</strong> {issPosition.azimuth.toFixed(2)}°</p>
          <p><strong>Elevation:</strong> {issPosition.elevation.toFixed(2)}°</p>
        </>
      )}
    </div>
  );
};

export default ISSCurrentPosition;