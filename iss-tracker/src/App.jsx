import { useState, useEffect } from 'react'
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

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
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
      },
      (error) => {
        setLocationError(`Unable to get location: ${error.message}`);
        const defaultLocation = {
          lat: 41.702,
          lng: -76.014,
          alt: 0
        };
        setObserverLocation(defaultLocation);

      }
    );
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
    fetchTLEData();
    getUserLocation();
    fetchISSPosition();
    const positionInterval = setInterval(fetchISSPosition, 5000);


  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };


  return (
    <div>
      <h1>ISS Tracker</h1>


      <div>
        <h2>Current Position</h2>
        <p>Satellite: {issTle.info.satname} (NORAD: {issTle.info.satid})</p>
        <p>Latitude: {issPosition.latitude.toFixed(6)}°</p>
        <p>Longitude: {issPosition.longitude.toFixed(6)}°</p>
        <p>Altitude: {issPosition.altitude?.toFixed(2)} km</p>
        <p>Time: {formatTimestamp(issPosition.timestamp)}</p>
        {issPosition.azimuth && (
          <>
            <p>Azimuth: {issPosition.azimuth.toFixed(2)}°</p>
            <p>Elevation: {issPosition.elevation.toFixed(2)}°</p>
          </>
        )}
      </div>


      <div>
        <h2>TLE Data</h2>
        <p>Line 1: {issTle.line1}</p>
        <p>Line 2: {issTle.line2}</p>
        <h2>Observer Location:</h2>
        <p>Latitude: {observerLocation.lat.toFixed(6)}</p>
        <p>Longitude: {observerLocation.lng.toFixed(6)}</p>
        <p>Altitude: {observerLocation.alt.toFixed(0)} meters</p>
      </div>
    </div>
  );
};

export default App
