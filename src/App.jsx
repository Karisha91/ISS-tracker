import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import ISSMap from './components/ISSMap';
import ObserverLocation from './components/ObserverLocation';
import ISSCurrentPosition from './components/ISSCurrentPosition';
import { useISSOrbit } from './hooks/useISSOrbit';
import VisibilityStatus from './components/VisibilityStatus';
import { calculateRealElevation } from './utils/elevationUtils';
import PassPredictions from './components/PassPredictions';
import YouTubeLive from './components/YouTubeLive.jsx';


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

  const { orbitPath, isVisible, satrec } = useISSOrbit(issTle, observerLocation);



  const getUserLocation = () => {
    const forcedLocation = {
      lat: 16.463,
      lng: 107.590,
      alt: 0
    };

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser');
        const defaultLocation = {
          lat: -45.86413,
          lng: -67.49656,
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
            alt: position.coords.altitude || 0,


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
      }
    } catch (error) {
      console.error('Error fetching ISS position:', error);
    }
  };

  const fetchTLEData = async () => {
    // Try free API first (no API key needed)
    const freeApiUrl = 'https://tle.ivanstanojevic.me/api/tle/25544';

    try {
      const response = await fetch(freeApiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Format to match your expected structure
      const tleData = {
        info: {
          satname: data.name,
          satid: data.satelliteId,
          transactionscount: 0
        },
        tle: data.line1 + '\r\n' + data.line2
      };

      const tleLines = tleData.tle.split('\r\n');
      setIssTle({
        raw: tleData.tle,
        line1: tleLines[0],
        line2: tleLines[1],
        info: tleData.info
      });

      return tleData;

    } catch (error) {
      console.error('Error fetching TLE data:', error);
      // You can keep your N2YO API as fallback if you want
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
      <Container maxWidth="lg" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          🛰️ ISS Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Loading satellite data...
        </Typography>
      </Container>
    );
  }

  return (
  <Container maxWidth="xl" sx={{ py: 3, minHeight: '100vh' }}>
    {/* Header */}
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #60a5fa 30%, #c4b5fd 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}
      >
        🛰️ ISS Tracker
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Real-time International Space Station Tracking
      </Typography>
    </Box>

    {/* Error Banner */}
    {locationError && (
      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Location Note:</strong> {locationError} - Using default location for demonstration.
      </Alert>
    )}

    {/* Main Content Grid */}
    <Grid container spacing={3}>
      {/* Left Column - Visibility & Predictions */}
      <Grid item xs={12} lg={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <VisibilityStatus
              isVisible={isVisible}
              elevation={realElevation}
              issPosition={issPosition}
            />
          </Paper>
          
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <PassPredictions
              satrec={satrec}
              observerLocation={observerLocation}
            />
          </Paper>
        </Box>
      </Grid>

      {/* Middle Column - Position & Observer Info */}
      <Grid item xs={12} lg={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <ISSCurrentPosition
              issPosition={issPosition}
              issTle={issTle}
              formatTimestamp={formatTimestamp}
              observerLocation={observerLocation}
              realElevation={realElevation}
            />
          </Paper>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <ObserverLocation observerLocation={observerLocation} />
          </Paper>
        </Box>
      </Grid>

      {/* Right Column - Map & YouTube */}
      <Grid item xs={12} lg={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', minHeight: 400 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                🗺️ Live Tracking Map
              </Typography>
              <ISSMap
                issPosition={issPosition}
                observerLocation={observerLocation}
                orbitPath={orbitPath}
                isVisible={isVisible}
              />
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <YouTubeLive />
          </Paper>
        </Box>
      </Grid>
    </Grid>
  </Container>
);
}

export default App;