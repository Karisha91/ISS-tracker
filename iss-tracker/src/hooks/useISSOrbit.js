// src/hooks/useISSOrbit.js
import { useState, useEffect, useCallback } from 'react';
import * as satellite from 'satellite.js';

export const useISSOrbit = (issTle) => {
  const [orbitPath, setOrbitPath] = useState([]);
  const [satrec, setSatrec] = useState(null);

  // Parse TLE and create satellite record
  const parseTLE = useCallback((line1, line2) => {
    try {
      return satellite.twoline2satrec(line1, line2);
    } catch (error) {
      console.error('Error parsing TLE:', error);
      return null;
    }
  }, []);

  // Calculate ISS position from TLE at specific time
  const calculateISSPosition = useCallback((satrec, date = new Date()) => {
    if (!satrec) return null;

    const positionAndVelocity = satellite.propagate(satrec, date);
    if (!positionAndVelocity.position) return null;

    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

    const latitude = satellite.degreesLat(positionGd.latitude);
    const longitude = satellite.degreesLong(positionGd.longitude);

    return { latitude, longitude };
  }, []);

  // Calculate orbit path (next 90 minutes)
  const calculateOrbitPath = useCallback((satrec) => {
    if (!satrec) return [];

    const path = [];
    const now = new Date();
    
    for (let i = 0; i < 90; i += 5) { // Every 5 minutes for 90 minutes
      const futureDate = new Date(now.getTime() + i * 60000);
      const position = calculateISSPosition(satrec, futureDate);
      if (position) {
        path.push([position.latitude, position.longitude]);
      }
    }
    
    return path;
  }, [calculateISSPosition]);

  // Initialize when TLE data changes
  useEffect(() => {
    if (issTle.line1 && issTle.line2) {
      const newSatrec = parseTLE(issTle.line1, issTle.line2);
      if (newSatrec) {
        setSatrec(newSatrec);
        const path = calculateOrbitPath(newSatrec);
        setOrbitPath(path);
      }
    }
  }, [issTle, parseTLE, calculateOrbitPath]);

  return { orbitPath, satrec };
};

export default useISSOrbit