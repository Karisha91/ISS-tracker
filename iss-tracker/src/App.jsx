import { useState, useEffect } from 'react'
import ISSMap from './components/ISSMap';
import './App.css'
import ObserverLocation from './components/ObserverLocation';
import ISSCurrentPosition from './components/ISSCurrentPosition';
import TLEData from './components/TLEData';
import { useISSOrbit } from './hooks/useISSOrbit';
import VisibilityStatus from './components/VisibilityStatus';

function App() {
  const [issPosition, setIssPosition] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    timestamp: 0
  });
  const [observerLocation, setObserverLocation] = useState({
    lat: 0,
    lng: 0,
    alt: 0
  });
  const [realElevation, setRealElevation] = useState(0);
  const [issTle, setIssTle] = useState({
    raw: '',
    line1: '',
    line2: '',
    info: { satname: '', satid: 0 }
  });
  const [locationError, setLocationError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { orbitPath, isVisible } = useISSOrbit(issTle, observerLocation);

  // Function to calculate elevation
  const calculateRealElevation = (issPos, obsLoc) => {
    if (!obsLoc || !issPos ||
      typeof obsLoc.lat !== 'number' ||
      typeof obsLoc.lng !== 'number' ||
      typeof issPos.latitude !== 'number' ||
      typeof issPos.longitude !== 'number') {
      return 0;
    }

    // Convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const toDegrees = (radians) => radians * (180 / Math.PI);

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

  const getUserLocation = () => {
    const forcedLocation = {
      lat:  32.266,
      lng: -85.896,
      alt: 0
    };
    
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser');
        const defaultLocation = {
          lat: 42.769,
          lng: 146.096,
          alt: 0
        };
        setObserverLocation(defaultLocation);
        resolve(defaultLocation);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            alt: position.coords.altitude || 0
          };
          setObserverLocation(forcedLocation);
          setLocationError('');
          resolve(newLocation);
        },
        (error) => {
          setLocationError(`Unable to get location: ${error.message}`);
          const defaultLocation = {
            lat: 41.702,
            lng: -76.014,
            alt: 0
          };
          setObserverLocation(defaultLocation);
          resolve(defaultLocation);
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    });
  };

  const fetchISSPosition = async () => {
    const proxyUrl = 'https://corsproxy.io/?';
    const { lat, lng, alt } = observerLocation;
    const seconds = 1;

    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/25544/${lat}/${lng}/${alt}/${seconds}/&apiKey=PVE8XA-6MCR8B-SLRNLM-5K7J`;

    try {
      const response = await fetch(proxyUrl + apiUrl);
      const data = await response.json();

      if (data.positions && data.positions.length > 0) {
        const position = data.positions[0];
        setIssPosition({
          latitude: position.satlatitude,
          longitude: position.satlongitude,
          altitude: position.sataltitude,
          timestamp: position.timestamp,
          azimuth: position.azimuth,
          elevation: position.elevation
        });
      }
    } catch (error) {
      console.error('Error fetching ISS position:', error);
    }
  };

  const fetchTLEData = async () => {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/tle/25544&apiKey=PVE8XA-6MCR8B-SLRNLM-5K7J`;

    try {
      const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.info && data.tle) {
        const tleLines = data.tle.split('\r\n');
        setIssTle({
          raw: data.tle,
          line1: tleLines[0],
          line2: tleLines[1],
          info: {
            satname: data.info.satname,
            satid: data.info.satid,
            transactionscount: data.info.transactionscount
          }
        });
        return data;
      }
    } catch (error) {
      console.error('Error fetching TLE data:', error);
    }
  };

  // Update elevation when ISS position or observer location changes
  useEffect(() => {
    if (issPosition && observerLocation) {
      const elevation = calculateRealElevation(issPosition, observerLocation);
      setRealElevation(elevation);
    }
  }, [issPosition, observerLocation]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        await getUserLocation();
        await fetchTLEData();
        await fetchISSPosition();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    const positionInterval = setInterval(fetchISSPosition, 5000);
    return () => clearInterval(positionInterval);
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <h1>ISS Tracker</h1>
        <p>Loading satellite data...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>ISS Tracker</h1>

      {locationError && (
        <div className="error-banner">
          <strong>Location Error:</strong> {locationError}
        </div>
      )}

      <div className="main-grid">
        {/* Left column - Data */}
        <div>
          <div className="data-card">
            <VisibilityStatus 
              isVisible={isVisible}
              elevation={realElevation} 
            />
            <ISSCurrentPosition 
              issPosition={issPosition} 
              issTle={issTle} 
              formatTimestamp={formatTimestamp} 
              observerLocation={observerLocation}
              realElevation={realElevation} // Pass elevation to ISSCurrentPosition
            />
          </div>

          <ObserverLocation observerLocation={observerLocation} />
        </div>

        {/* Right column - Map */}
        <div>
          <div className="map-container">
            <ISSMap 
              issPosition={issPosition} 
              observerLocation={observerLocation} 
              orbitPath={orbitPath}
              isVisible={isVisible}
            />
          </div>
        </div>
      </div>

      {/* TLE Data */}
      <TLEData issTle={issTle}></TLEData>
    </div>
  );
}

export default App;