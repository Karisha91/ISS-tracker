// src/components/ISSMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ISSMap.css';

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
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    className: 'satellite-theme'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    className: 'dark-theme'
  },
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    className: 'standard-theme'
  }
};

const ISSMap = ({ issPosition, observerLocation, orbitPath = [], isVisible }) => {
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

  return (
    <div className="iss-map-container">
      <div className="theme-toggle-container">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Toggle map theme"
        >
          {currentTheme === 'satellite' && '🛰️'}
          {currentTheme === 'dark' && '🌙'}
          {currentTheme === 'standard' && '🗺️'}
        </button>
      </div>

      <MapContainer
        center={issLatLng}
        zoom={3}
        className={`leaflet-container ${themes[currentTheme].className}`}
      >
        <TileLayer
          url={themes[currentTheme].url}
          attribution={themes[currentTheme].attribution}
        />

        {/* ISS Marker */}
        <Marker position={issLatLng} icon={issIcon}>
          <Popup className="custom-popup">
            <div className="popup-content">
              <strong>ISS Current Position</strong><br />
              Lat: {issPosition.latitude.toFixed(4)}°<br />
              Lng: {issPosition.longitude.toFixed(4)}°<br />
              Alt: {issPosition.altitude} km<br />
              Velocity: {issPosition.velocity?.toFixed(2) || 'N/A'} km/h
            </div>
          </Popup>
        </Marker>

        {/* Observer Location */}
        <Marker position={observerLatLng} icon={observerIcon}>
          <Popup className="custom-popup">
            <div className="popup-content">
              <strong>Your Location</strong><br />
              Lat: {observerLocation.lat.toFixed(4)}°<br />
              Lng: {observerLocation.lng.toFixed(4)}°<br />
              Alt: {observerLocation.alt} meters<br />
              <strong>ISS Visibility:</strong> {isVisible ?
                <span className="visible-status">🔭 Visible Now!</span> :
                <span className="not-visible-status">🌌 Not Visible</span>}
            </div>
          </Popup>
        </Marker>
        {/* Orbit Path */}
        {orbitPath.length > 0 && (
          <Polyline
            positions={orbitPath}
            color={currentTheme === 'satellite' ? '#f0fa60ff' : '#eb2525ff'}
            weight={2}
            opacity={0.7}
          />
        )}

        {/* Visibility circle */}
        <Circle
          center={observerLatLng}
          radius={1000000}
          color={isVisible ? '#10b981' : '#ef4444'}
          fillColor={isVisible ? '#10b981' : '#ef4444'}
          fillOpacity={0.1}
          weight={2}
        />
      </MapContainer>
    </div>
  );
};

export default ISSMap;