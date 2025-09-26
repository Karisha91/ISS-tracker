// src/components/ISSMap.jsx
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Public as PublicIcon,
  MyLocation as MyLocationIcon,
  Satellite as SatelliteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Layers as LayersIcon,
  Navigation as NavigationIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const issIcon = new L.Icon({
  iconUrl: 'https://static.isstracker.pl/images/satellites_icon/4/44/iss-25544.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Custom observer icon
const observerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.2"/>
      <circle cx="12" cy="12" r="8" fill="#3b82f6" opacity="0.4"/>
      <circle cx="12" cy="12" r="5" fill="#3b82f6"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Theme configurations
const themes = {
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    icon: '🛰️',
    color: 'primary'
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    icon: '🌙',
    color: 'secondary'
  },
  standard: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: '🗺️',
    color: 'info'
  }
};

const ISSMap = ({ issPosition, observerLocation, orbitPath = [], isVisible }) => {
  const theme = useTheme();
  const [currentTheme, setCurrentTheme] = useState('satellite');
  const issLatLng = [issPosition.latitude, issPosition.longitude];
  const observerLatLng = [observerLocation.lat, observerLocation.lng];

  // Function to rotate through themes
  const toggleTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setCurrentTheme(themeKeys[nextIndex]);
  };

  const currentThemeConfig = themes[currentTheme];

  return (
    <Card 
      elevation={3}
      sx={{
        borderRadius: 2,
        background: 'linear-gradient(135deg, #1e293b 0%, #1a2436 100%)',
        height: '100%'
      }}
    >
      <CardHeader
        title={
          <Typography variant="h5" component="h2" fontWeight="bold">
            🗺️ Live Tracking Map
          </Typography>
        }
        subheader="Real-time ISS position and orbit visualization"
        action={
          <Tooltip title={`Switch to ${themes[Object.keys(themes)[(Object.keys(themes).indexOf(currentTheme) + 1) % Object.keys(themes).length]].name} view`}>
            <IconButton 
              onClick={toggleTheme}
              sx={{
                backgroundColor: theme.palette[currentThemeConfig.color].main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette[currentThemeConfig.color].dark,
                }
              }}
            >
              <LayersIcon />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {/* Map Header Info */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette[currentThemeConfig.color].light}20, ${theme.palette[currentThemeConfig.color].light}10)`,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<SatelliteIcon />}
              label={`${currentThemeConfig.name} View`}
              color={currentThemeConfig.color}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                label={isVisible ? 'ISS Visible' : 'ISS Not Visible'}
                color={isVisible ? 'success' : 'error'}
                variant="filled"
                size="small"
              />
              <Chip
                icon={<MyLocationIcon />}
                label={`Zoom: 3x`}
                color="default"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Paper>

        {/* Map Container */}
        <Box sx={{ position: 'relative', height: 600 }}>
          <MapContainer
            center={issLatLng}
            zoom={3}
            style={{ height: '100%', width: '100%', borderRadius: '0 0 8px 8px' }}
          >
            <TileLayer
              url={currentThemeConfig.url}
              attribution={currentThemeConfig.attribution}
            />

            {/* ISS Marker */}
            <Marker position={issLatLng} icon={issIcon}>
              <Popup>
                <Box sx={{ p: 1, minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <SatelliteIcon sx={{ mr: 1, color: 'primary.main' }} />
                    ISS Current Position
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2">
                      <strong>Lat:</strong> {issPosition.latitude.toFixed(4)}°
                    </Typography>
                    <Typography variant="body2">
                      <strong>Lng:</strong> {issPosition.longitude.toFixed(4)}°
                    </Typography>
                    <Typography variant="body2">
                      <strong>Alt:</strong> {issPosition.altitude} km
                    </Typography>
                    <Typography variant="body2">
                      <strong>Velocity:</strong> {issPosition.velocity?.toFixed(2) || 'N/A'} km/h
                    </Typography>
                  </Box>
                </Box>
              </Popup>
            </Marker>

            {/* Observer Location */}
            <Marker position={observerLatLng} icon={observerIcon}>
              <Popup>
                <Box sx={{ p: 1, minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <MyLocationIcon sx={{ mr: 1, color: 'info.main' }} />
                    Your Location
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2">
                      <strong>Lat:</strong> {observerLocation.lat.toFixed(4)}°
                    </Typography>
                    <Typography variant="body2">
                      <strong>Lng:</strong> {observerLocation.lng.toFixed(4)}°
                    </Typography>
                    <Typography variant="body2">
                      <strong>Alt:</strong> {observerLocation.alt} meters
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        icon={isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        label={isVisible ? 'Visible Now!' : 'Not Visible'}
                        color={isVisible ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              </Popup>
            </Marker>

            {/* Orbit Path */}
            {orbitPath.length > 0 && (
              <Polyline
                positions={orbitPath}
                color={theme.palette.warning.main}
                weight={3}
                opacity={0.8}
              />
            )}

            {/* Visibility circle */}
            <Circle
              center={observerLatLng}
              radius={1000000}
              color={isVisible ? theme.palette.success.main : theme.palette.error.main}
              fillColor={isVisible ? theme.palette.success.main : theme.palette.error.main}
              fillOpacity={0.1}
              weight={2}
            />
          </MapContainer>
        </Box>

        {/* Map Footer */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette.grey[900]}20, ${theme.palette.grey[900]}10)`,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    mr: 1
                  }}
                />
                <Typography variant="caption">ISS Position</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.info.main,
                    mr: 1
                  }}
                />
                <Typography variant="caption">Your Location</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.warning.main,
                    mr: 1
                  }}
                />
                <Typography variant="caption">Orbit Path</Typography>
              </Box>
            </Box>
            
            <Chip
              icon={<NavigationIcon />}
              label={`Tracked: ${new Date().toLocaleTimeString()}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ISSMap;
