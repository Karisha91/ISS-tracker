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

  // Get compass direction from coordinates
  const getHemisphere = (coord, type) => {
    if (type === 'lat') {
      return coord >= 0 ? 'N' : 'S';
    } else if (type === 'lng') {
      return coord >= 0 ? 'E' : 'W';
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
      <h2>Observer Location</h2>
      <p className="location-subtitle">Your current observation point</p>
      
      {isLoading ? (
        <div className="loading-location">
          <p>Loading location data...</p>
        </div>
      ) : (
        <>
          <div className="location-header">
            <h3>{locationName}</h3>
          </div>

          <div className="coordinates-grid">
            <div className="coordinate-item">
              <div className="coordinate-detail">
                <span className="detail-label">Latitude</span>
                <span className="detail-value">
                  {Math.abs(observerLocation.lat).toFixed(6)}° {getHemisphere(observerLocation.lat, 'lat')}
                </span>
              </div>
            </div>

            <div className="coordinate-item">
              <div className="coordinate-detail">
                <span className="detail-label">Longitude</span>
                <span className="detail-value">
                  {Math.abs(observerLocation.lng).toFixed(6)}° {getHemisphere(observerLocation.lng, 'lng')}
                </span>
              </div>
            </div>

            <div className="coordinate-item">
              <div className="coordinate-detail">
                <span className="detail-label">Altitude</span>
                <span className="detail-value">
                  {observerLocation.alt.toFixed(0)} meters
                </span>
              </div>
            </div>

            <div className="coordinate-item">
              <div className="coordinate-detail">
                <span className="detail-label">Timezone</span>
                <span className="detail-value">
                  {getApproximateTimezone(observerLocation.lng)}
                </span>
              </div>
            </div>
          </div>

          <div className="location-actions">
            <a 
              href={`https://www.google.com/maps?q=${observerLocation.lat},${observerLocation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-button"
            >
              View on Google Maps
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default ObserverLocation;