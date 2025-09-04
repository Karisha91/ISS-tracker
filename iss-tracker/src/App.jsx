import { useState, useEffect } from 'react'
import ISSMap from './components/ISSMap';
import './App.css'
import ObserverLocation from './components/ObserverLocation';
import ISSCurrentPosition from './components/ISSCurrentPosition';
import TLEData from './components/TLEData';
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
  const [issTle, setIssTle] = useState({
    raw: '',
    line1: '',
    line2: '',
    info: { satname: '', satid: 0 }
  });
  const [locationError, setLocationError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser');
        const defaultLocation = {
          lat: 41.702,
          lng: -76.014,
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
          setObserverLocation(newLocation);
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
        console.log('Position updated:', position.satlatitude, position.satlongitude);
      }
    } catch (error) {
      console.error('Error fetching ISS position:', error);
    }
  }

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
  }

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
            <ISSCurrentPosition 
            issPosition={issPosition} 
            issTle={issTle} 
            formatTimestamp={formatTimestamp} 
          />
          </div>

          <ObserverLocation observerLocation={observerLocation} />
        </div>

        {/* Right column - Map */}
        <div>
          <div className="map-container">
            <ISSMap issPosition={issPosition} observerLocation={observerLocation} />
          </div>
        </div>
      </div>

      {/* TLE Data */}
      <TLEData issTle={issTle}></TLEData>
    </div>
  );
};


export default App