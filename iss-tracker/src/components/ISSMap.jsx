// src/components/ISSMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const ISSMap = ({ issPosition, observerLocation, orbitPath = [] }) => {
  const issLatLng = [issPosition.latitude, issPosition.longitude];
  const observerLatLng = [observerLocation.lat, observerLocation.lng];

  return (
    <MapContainer
      center={issLatLng}
      zoom={3}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* ISS Marker */}
      <Marker position={issLatLng} icon={issIcon}>
        <Popup>
          <strong>ISS Current Position</strong><br />
          Lat: {issPosition.latitude.toFixed(4)}°<br />
          Lng: {issPosition.longitude.toFixed(4)}°<br />
          Alt: {issPosition.altitude} km
        </Popup>
      </Marker>

      {/* Observer Location */}
      <Marker position={observerLatLng}>
        <Popup>
          <strong>Your Location</strong><br />
          Lat: {observerLocation.lat.toFixed(4)}°<br />
          Lng: {observerLocation.lng.toFixed(4)}°<br />
          Alt: {observerLocation.alt} meters
        </Popup>
      </Marker>

      {/* Orbit Path */}
      {orbitPath.length > 0 && (
        <Polyline
          positions={orbitPath}
          color="blue"
          weight={1}
          opacity={0.6}
          dashArray="3, 3"
        />
      )}

      {/* Visibility circle */}
      <Circle
        center={observerLatLng}
        radius={1000000}
        color="blue"
        fillOpacity={0.1}
      />
    </MapContainer>
  );
};

export default ISSMap;