import { useState, useEffect } from 'react'
import ISSMap from './components/ISSMap'; // Import your component
import './App.css'

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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>ISS Tracker</h1>
        <p>Loading satellite data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>ISS Tracker</h1>

      {locationError && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Location Error:</strong> {locationError}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Left column - Data */}
        <div>
          <div style={{ 
            backgroundColor: '#000000ff', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2>Current Position</h2>
            <p><strong>Satellite:</strong> {issTle.info.satname || 'SPACE STATION'} (NORAD: {issTle.info.satid || 25544})</p>
            <p><strong>Latitude:</strong> {issPosition.latitude.toFixed(6)}°</p>
            <p><strong>Longitude:</strong> {issPosition.longitude.toFixed(6)}°</p>
            <p><strong>Altitude:</strong> {issPosition.altitude?.toFixed(2) || '0'} km</p>
            <p><strong>Time:</strong> {formatTimestamp(issPosition.timestamp)}</p>
            {issPosition.azimuth && (
              <>
                <p><strong>Azimuth:</strong> {issPosition.azimuth.toFixed(2)}°</p>
                <p><strong>Elevation:</strong> {issPosition.elevation.toFixed(2)}°</p>
              </>
            )}
          </div>

          <div style={{ 
            backgroundColor: '#000000ff', 
            padding: '20px', 
            borderRadius: '8px' 
          }}>
            <h2>Observer Location</h2>
            <p><strong>Latitude:</strong> {observerLocation.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {observerLocation.lng.toFixed(6)}</p>
            <p><strong>Altitude:</strong> {observerLocation.alt.toFixed(0)} meters</p>
          </div>
        </div>

        {/* Right column - Map */}
        <div>
          <div style={{ 
            backgroundColor: '#000000ff', 
            padding: '20px', 
            borderRadius: '8px',
            height: '500px'
          }}>
            <ISSMap issPosition={issPosition} observerLocation={observerLocation} />
          </div>
        </div>
      </div>

      {/* TLE Data */}
      <div style={{ 
        backgroundColor: '#000000ff', 
        padding: '20px', 
        borderRadius: '8px' 
      }}>
        <h2>TLE Data</h2>
        <p style={{ 
          fontFamily: 'monospace', 
          fontSize: '12px', 
          backgroundColor: '#000000ff', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          <strong>Line 1:</strong> {issTle.line1 || '1 25544U 98067A   24072.45833333  .00020674  00000-0  37224-3 0  9997'}<br />
          <strong>Line 2:</strong> {issTle.line2 || '2 25544  51.6404  55.9163 0001727  26.6688  64.1273 15.49970316443794'}
        </p>
      </div>
    </div>
  );
};

export default App