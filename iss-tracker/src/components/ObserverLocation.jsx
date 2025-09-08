import React, { useState, useEffect } from 'react';
import './ObserverLocation.css';

const ObserverLocation = ({ observerLocation }) => {
  const [locationName, setLocationName] = useState('Loading location...');
  const [isLoading, setIsLoading] = useState(true);

  // Reverse geocoding to get location name
  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${observerLocation.lat}&longitude=${observerLocation.lng}&localityLanguage=en`
        );
        const data = await response.json();
        
        if (data.city && data.countryName) {
          setLocationName(`${data.city}, ${data.countryName}`);
        } else if (data.locality) {
          setLocationName(`${data.locality}, ${data.countryName}`);
        } else {
          setLocationName(`${data.countryName || 'Unknown location'}`);
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
        setLocationName('Location name unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    if (observerLocation.lat && observerLocation.lng) {
      fetchLocationName();
    }
  }, [observerLocation.lat, observerLocation.lng]);

  // Get compass direction from coordinates - FIXED
  const getHemisphere = (coord, type) => {
    if (type === 'lat') {
      const dir = coord >= 0 ? 'N' : 'S';
      return `${Math.abs(coord).toFixed(2)}°${dir}`;
    } else if (type === 'lng') {
      const dir = coord >= 0 ? 'E' : 'W';
      return `${Math.abs(coord).toFixed(2)}°${dir}`;
    }
    return '';
  };

  // Get approximate timezone
  const getApproximateTimezone = (lng) => {
    const timezoneOffset = Math.round(lng / 15);
    return `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
  };

  return (
    <div className="observer-location-card">
      <h2>📍 Observer Location</h2>
      
      {/* Location Name */}
      <div className="location-header">
        <div className="location-name">
          {isLoading ? (
            <div className="loading-text">Loading location...</div>
          ) : (
            <h3>{locationName}</h3>
          )}
        </div>
      </div>

      {/* Coordinates in a nice grid */}
      <div className="coordinates-grid">
        <div className="coordinate-item">
          <div className="coordinate-label">
            <span className="coordinate-icon">🌐</span>
            Latitude
          </div>
          <div className="coordinate-value">
            {observerLocation.lat.toFixed(6)}
          </div>
          <div className="coordinate-dms">
            {getHemisphere(observerLocation.lat, 'lat')}
          </div>
        </div>

        <div className="coordinate-item">
          <div className="coordinate-label">
            <span className="coordinate-icon">🌐</span>
            Longitude
          </div>
          <div className="coordinate-value">
            {observerLocation.lng.toFixed(6)}
          </div>
          <div className="coordinate-dms">
            {getHemisphere(observerLocation.lng, 'lng')}
          </div>
        </div>

        <div className="coordinate-item">
          <div className="coordinate-label">
            <span className="coordinate-icon">⛰️</span>
            Altitude
          </div>
          <div className="coordinate-value">
            {observerLocation.alt.toFixed(0)} meters
          </div>
          <div className="coordinate-dms">
            {observerLocation.alt > 0 ? 'Above sea level' : 'Sea level'}
          </div>
        </div>

        <div className="coordinate-item">
          <div className="coordinate-label">
            <span className="coordinate-icon">⏰</span>
            Timezone
          </div>
          <div className="coordinate-value">
            {getApproximateTimezone(observerLocation.lng)}
          </div>
          <div className="coordinate-dms">
            Approximate
          </div>
        </div>
      </div>

      

      {/* Map link */}
      <div className="map-link">
        <a 
          href={`https://www.google.com/maps?q=${observerLocation.lat},${observerLocation.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-button"
        >
          📍 View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default ObserverLocation;