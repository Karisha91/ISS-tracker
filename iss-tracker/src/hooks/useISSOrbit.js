// src/hooks/useISSOrbit.js
import { useState, useEffect, useCallback } from 'react';
import * as satellite from 'satellite.js';

export const useISSOrbit = (issTle, observerLocation) => {
  const [orbitPath, setOrbitPath] = useState([]);
  const [satrec, setSatrec] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // ← NEW: Visibility state

  // Parse TLE and create satellite record (keep existing)
  const parseTLE = useCallback((line1, line2) => {
    try {
      return satellite.twoline2satrec(line1, line2);
    } catch (error) {
      console.error('Error parsing TLE:', error);
      return null;
    }
  }, []);

  // Calculate ISS position from TLE (keep existing)
  const calculateISSPosition = useCallback((satrec, date = new Date()) => {
    if (!satrec) return null;
    try {
      const positionAndVelocity = satellite.propagate(satrec, date);
      if (!positionAndVelocity || !positionAndVelocity.position) return null;
      const gmst = satellite.gstime(date);
      const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      if (!positionGd) return null;
      const latitude = satellite.degreesLat(positionGd.latitude);
      const longitude = satellite.degreesLong(positionGd.longitude);
      const altitude = positionGd.height;
      return { latitude, longitude, altitude };
    } catch (error) {
      console.error('Error calculating position:', error);
      return null;
    }
  }, []);

  // Calculate orbit path (keep existing)
  const calculateOrbitPath = useCallback((satrec) => {
    if (!satrec) return [];
    const path = [];
    const now = new Date();
    for (let i = 0; i < 90; i += 5) {
      const futureDate = new Date(now.getTime() + i * 60000);
      const position = calculateISSPosition(satrec, futureDate);
      if (position) {
        path.push([position.latitude, position.longitude]);
      }
    }
    return path;
  }, [calculateISSPosition]);

const checkCurrentVisibility = useCallback((satrec, observerLat, observerLng, observerAlt) => {
  if (!satrec) return false;

  try {
    const now = new Date();
    
    // Simple distance-based visibility
    const positionAndVelocity = satellite.propagate(satrec, now);
    if (!positionAndVelocity.position) return false;

    const gmst = satellite.gstime(now);
    const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
    
    const issLat = satellite.degreesLat(positionGd.latitude);
    const issLng = satellite.degreesLong(positionGd.longitude);
    
    // Calculate angular distance
    const latDiff = Math.abs(issLat - observerLat);
    const lngDiff = Math.abs(issLng - observerLng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    
    console.log('📏 Angular distance:', distance.toFixed(2) + '°');
    
    // If within 2 degrees, consider it visible
    // (This is an approximation, but it works)
    return distance < 2.0;

  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}, []);
  // Initialize when TLE data or observer location changes
  useEffect(() => {
    if (issTle.line1 && issTle.line2 && observerLocation.lat && observerLocation.lng) {
      const newSatrec = parseTLE(issTle.line1, issTle.line2);
      if (newSatrec) {
        setSatrec(newSatrec);
        
        // Calculate orbit path (existing)
        const path = calculateOrbitPath(newSatrec);
        setOrbitPath(path);
        
        // NEW: Calculate visibility status
        const visible = checkCurrentVisibility(
          newSatrec, 
          observerLocation.lat, 
          observerLocation.lng, 
          observerLocation.alt
        );
        setIsVisible(visible);
      }
    }
  }, [issTle, observerLocation, parseTLE, calculateOrbitPath, checkCurrentVisibility]);

  return { orbitPath, isVisible, satrec }; // ← Add isVisible to return
};