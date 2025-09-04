
import React from 'react';

const ObserverLocation = ({ observerLocation }) => {
  return (
    <div className="data-card">
      <h2>Observer Location</h2>
      <p><strong>Latitude:</strong> {observerLocation.lat.toFixed(6)}</p>
      <p><strong>Longitude:</strong> {observerLocation.lng.toFixed(6)}</p>
      <p><strong>Altitude:</strong> {observerLocation.alt.toFixed(0)} meters</p>
    </div>
  );
};

export default ObserverLocation;