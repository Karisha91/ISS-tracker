// utils/directionUtils.js
export const getCardinalDirection = (azimuth) => {
  if (azimuth === undefined || azimuth === null) return 'up';
  
  // Normalize azimuth to 0-360 range
  const normalizedAzimuth = (azimuth + 360) % 360;
  
  const directions = [
    'North', 'North-Northeast', 'Northeast', 'East-Northeast',
    'East', 'East-Southeast', 'Southeast', 'South-Southeast',
    'South', 'South-Southwest', 'Southwest', 'West-Southwest',
    'West', 'West-Northwest', 'Northwest', 'North-Northwest'
  ];
  
  const index = Math.round(normalizedAzimuth / 22.5) % 16;
  return directions[index];
};

export const getSimpleDirection = (azimuth) => {
  if (azimuth === undefined || azimuth === null) return 'up';
  
  const normalizedAzimuth = (azimuth + 360) % 360;
  
  if (normalizedAzimuth >= 337.5 || normalizedAzimuth < 22.5) return 'north';
  if (normalizedAzimuth >= 22.5 && normalizedAzimuth < 67.5) return 'northeast';
  if (normalizedAzimuth >= 67.5 && normalizedAzimuth < 112.5) return 'east';
  if (normalizedAzimuth >= 112.5 && normalizedAzimuth < 157.5) return 'southeast';
  if (normalizedAzimuth >= 157.5 && normalizedAzimuth < 202.5) return 'south';
  if (normalizedAzimuth >= 202.5 && normalizedAzimuth < 247.5) return 'southwest';
  if (normalizedAzimuth >= 247.5 && normalizedAzimuth < 292.5) return 'west';
  if (normalizedAzimuth >= 292.5 && normalizedAzimuth < 337.5) return 'northwest';
  
  return 'up';
};

export const getArrowIcon = (azimuth) => {
  if (azimuth === undefined || azimuth === null) return '⬆️';
  
  const normalizedAzimuth = (azimuth + 360) % 360;
  
  if (normalizedAzimuth >= 337.5 || normalizedAzimuth < 22.5) return '⬆️'; // North
  if (normalizedAzimuth >= 22.5 && normalizedAzimuth < 67.5) return '↗️'; // Northeast
  if (normalizedAzimuth >= 67.5 && normalizedAzimuth < 112.5) return '➡️'; // East
  if (normalizedAzimuth >= 112.5 && normalizedAzimuth < 157.5) return '↘️'; // Southeast
  if (normalizedAzimuth >= 157.5 && normalizedAzimuth < 202.5) return '⬇️'; // South
  if (normalizedAzimuth >= 202.5 && normalizedAzimuth < 247.5) return '↙️'; // Southwest
  if (normalizedAzimuth >= 247.5 && normalizedAzimuth < 292.5) return '⬅️'; // West
  if (normalizedAzimuth >= 292.5 && normalizedAzimuth < 337.5) return '↖️'; // Northwest
  
  return '⬆️';
};