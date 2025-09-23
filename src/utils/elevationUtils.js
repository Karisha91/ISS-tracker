// src/utils/elevationUtils.js

// Convert degrees to radians
export const toRadians = (degrees) => degrees * (Math.PI / 180);

// Convert radians to degrees  
export const toDegrees = (radians) => radians * (180 / Math.PI);

// Calculate elevation based on observer position and ISS position
export const calculateRealElevation = (issPos, obsLoc) => {
  if (!obsLoc || !issPos ||
    typeof obsLoc.lat !== 'number' ||
    typeof obsLoc.lng !== 'number' ||
    typeof issPos.latitude !== 'number' ||
    typeof issPos.longitude !== 'number') {
    return 0;
  }

  // Earth's radius in km
  const R = 6371;

  // Observer position (convert to radians)
  const φ1 = toRadians(obsLoc.lat);
  const λ1 = toRadians(obsLoc.lng);
  const h1 = 0; // Observer altitude (sea level)

  // ISS position (convert to radians)
  const φ2 = toRadians(issPos.latitude);
  const λ2 = toRadians(issPos.longitude);
  const h2 = issPos.altitude || 420; // ISS altitude in km (default to 420km)

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
  const straightDistance = Math.sqrt(R * R + (R + h2) * (R + h2) - 2 * R * (R + h2) * Math.cos(c));

  // Calculate elevation angle using trigonometry
  const elevationRad = Math.asin(((R + h2) * Math.cos(c) - R) / straightDistance);
  const elevationDeg = toDegrees(elevationRad);

  return Math.max(-90, Math.min(90, elevationDeg));
};