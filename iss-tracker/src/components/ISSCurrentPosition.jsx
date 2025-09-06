import React from 'react';

const ISSCurrentPosition = ({ issPosition, issTle, formatTimestamp, observerLocation }) => {
  // Calculate proper elevation based on observer position and ISS position
  const calculateRealElevation = () => {
    if (!observerLocation || !issPosition ||
      typeof observerLocation.lat !== 'number' ||
      typeof observerLocation.lng !== 'number' ||
      typeof issPosition.latitude !== 'number' ||
      typeof issPosition.longitude !== 'number') {
      return 0;
    }

    // Convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const toDegrees = (radians) => radians * (180 / Math.PI);

    // Earth's radius in km
    const R = 6371;

    // Observer position (convert to radians)
    const φ1 = toRadians(observerLocation.lat);
    const λ1 = toRadians(observerLocation.lng);
    const h1 = 0; // Observer altitude (sea level)

    // ISS position (convert to radians)
    const φ2 = toRadians(issPosition.latitude);
    const λ2 = toRadians(issPosition.longitude);
    const h2 = issPosition.altitude || 420; // ISS altitude in km (default to 420km)

    // Calculate differences
    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;

    // Haversine formula for great-circle distance
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance along Earth's surface in km

    // Calculate the straight-line distance between observer and ISS
    // Using the law of cosines for the spherical triangle
    const straightDistance = Math.sqrt(R * R + (R + h2) * (R + h2) - 2 * R * (R + h2) * Math.cos(c));

    // Calculate elevation angle using trigonometry
    // sin(elevation) = opposite/hypotenuse = (ISS height - observer height adjustment)/straightDistance
    // But we need to account for Earth's curvature
    const elevationRad = Math.asin(((R + h2) * Math.cos(c) - R) / straightDistance);
    const elevationDeg = toDegrees(elevationRad);

    return Math.max(-90, Math.min(90, elevationDeg));
  };

  const realElevation = calculateRealElevation();

  // Check if we have valid data
  const hasValidPosition = issPosition &&
    typeof issPosition.latitude === 'number' &&
    typeof issPosition.longitude === 'number';

  const hasObserverLocation = observerLocation &&
    typeof observerLocation.lat === 'number' &&
    typeof observerLocation.lng === 'number';

  // DEBUG: Add this to see what's happening
  if (hasValidPosition && hasObserverLocation) {
    console.log('🔍 ELEVATION DEBUG:', {
      issPos: { lat: issPosition.latitude, lng: issPosition.longitude, alt: issPosition.altitude },
      obsPos: { lat: observerLocation.lat, lng: observerLocation.lng },
      calculatedElevation: realElevation
    });
  }

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

      {/* Only show azimuth if it exists */}
      {issPosition?.azimuth && (
        <p><strong>Azimuth:</strong> {issPosition.azimuth.toFixed(2)}°</p>
      )}
    </div>
  );
};

export default ISSCurrentPosition;