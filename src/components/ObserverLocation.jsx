import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Public as PublicIcon,
  Height as HeightIcon,
  Schedule as ScheduleIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';

const ObserverLocation = ({ observerLocation }) => {
  const theme = useTheme();
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

  // Location data items
  const locationData = [
    {
      icon: <PublicIcon color="primary" />,
      label: 'Latitude',
      value: `${Math.abs(observerLocation.lat).toFixed(6)}° ${getHemisphere(observerLocation.lat, 'lat')}`,
      color: theme.palette.primary.main
    },
    {
      icon: <PublicIcon color="primary" />,
      label: 'Longitude',
      value: `${Math.abs(observerLocation.lng).toFixed(6)}° ${getHemisphere(observerLocation.lng, 'lng')}`,
      color: theme.palette.primary.main
    },
    {
      icon: <HeightIcon color="secondary" />,
      label: 'Altitude',
      value: `${observerLocation.alt.toFixed(0)} meters`,
      color: theme.palette.secondary.main
    },
    {
      icon: <ScheduleIcon color="info" />,
      label: 'Timezone',
      value: getApproximateTimezone(observerLocation.lng),
      color: theme.palette.info.main
    }
  ];

  return (
    <Card 
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'visible',
        background: 'linear-gradient(135deg, #1e293b 0%, #1a2436 100%)'
      }}
    >
      <CardHeader
        title={
          <Typography variant="h5" component="h2" fontWeight="bold">
            📍 Observer Location
          </Typography>
        }
        subheader="Your current observation point"
      />
      
      <CardContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading location data...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Location Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  mr: 2
                }}
              >
                <LocationIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  {locationName}
                </Typography>
                <Chip 
                  label="Active Observer" 
                  size="small" 
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Coordinates Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {locationData.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${item.color}10, ${item.color}05)`,
                      border: `1px solid ${item.color}20`
                    }}
                  >
                    <Box sx={{ mr: 2, color: item.color }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                        {item.label}
                      </Typography>
                      <Typography variant="h6" color="text.primary" fontWeight="bold">
                        {item.value}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Map Action */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                startIcon={<ExploreIcon />}
                href={`https://www.google.com/maps?q=${observerLocation.lat},${observerLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  background: 'linear-gradient(45deg, #60a5fa 30%, #c4b5fd 90%)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3b82f6 30%, #a78bfa 90%)',
                  }
                }}
              >
                View on Google Maps
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ObserverLocation;