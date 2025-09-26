import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import {
  Satellite as SatelliteIcon,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  School as SchoolIcon,
  Navigation as NavigationIcon,
  Height as HeightIcon,
  MyLocation as LocationIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';

const ISSCurrentPosition = ({ issPosition, issTle, formatTimestamp, observerLocation, realElevation }) => {
  const theme = useTheme();
  
  // Check if we have valid data
  const hasValidPosition = issPosition &&
    typeof issPosition.latitude === 'number' &&
    typeof issPosition.longitude === 'number';

  // Convert km/s to more understandable units
  const velocityKmS = 7.66; // ISS orbital velocity
  const velocityKmH = velocityKmS * 3600; // Convert to km/h
  const velocityMph = velocityKmH * 0.621371; // Convert to mph

  // Satellite info
  const satelliteInfo = {
    name: issTle?.info?.satname || 'SPACE STATION',
    noradId: issTle?.info?.satid || 25544
  };

  // Position data
  const positionData = [
    {
      icon: <PublicIcon color="primary" />,
      label: 'Latitude',
      value: hasValidPosition ? `${issPosition.latitude.toFixed(6)}°` : 'N/A',
      color: theme.palette.primary.main
    },
    {
      icon: <PublicIcon color="primary" />,
      label: 'Longitude',
      value: hasValidPosition ? `${issPosition.longitude.toFixed(6)}°` : 'N/A',
      color: theme.palette.primary.main
    },
    {
      icon: <HeightIcon color="secondary" />,
      label: 'Altitude',
      value: issPosition?.altitude ? `${issPosition.altitude.toFixed(2)} km` : 'N/A',
      color: theme.palette.secondary.main
    }
  ];

  // Observation data
  const observationData = [
    {
      icon: <ScheduleIcon color="info" />,
      label: 'Time',
      value: issPosition?.timestamp ? formatTimestamp(issPosition.timestamp) : 'N/A',
      color: theme.palette.info.main
    },
    {
      icon: <NavigationIcon color="success" />,
      label: 'Elevation',
      value: `${realElevation.toFixed(2)}°`,
      color: theme.palette.success.main
    },
    ...(issPosition?.azimuth ? [{
      icon: <LocationIcon color="warning" />,
      label: 'Azimuth',
      value: `${issPosition.azimuth.toFixed(2)}°`,
      color: theme.palette.warning.main
    }] : [])
  ];

  // Velocity data
  const velocityData = [
    {
      icon: <SpeedIcon color="error" />,
      label: 'Velocity',
      value: `${velocityKmS.toFixed(2)} km/s`,
      color: theme.palette.error.main
    },
    {
      icon: <SpeedIcon color="error" />,
      label: 'Speed',
      value: `${velocityKmH.toFixed(0)} km/h (${velocityMph.toFixed(0)} mph)`,
      color: theme.palette.error.main
    }
  ];

  // Educational facts
  const educationalFacts = [
    { icon: '🛰️', text: 'Orbits at 400 km altitude' },
    { icon: '⚡', text: 'Travels at 27,600 km/h' },
    { icon: '🌍', text: 'Circles Earth every 90 minutes' },
    { icon: '✨', text: 'Appears as a bright, fast-moving star' }
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
            🛰️ Current Position
          </Typography>
        }
        subheader="Real-time International Space Station tracking data"
      />
      
      <CardContent>
        {/* Satellite Info Banner */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.light}10)`,
            border: `1px solid ${theme.palette.primary.light}30`,
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                mr: 2
              }}
            >
              <SatelliteIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold">
                {satelliteInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NORAD ID: {satelliteInfo.noradId}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Position Data */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ExploreIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Position
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {positionData.map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
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
        </Box>

        {/* Observation Data */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <NavigationIcon sx={{ mr: 1, color: theme.palette.info.main }} />
            Time & Observation
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {observationData.map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
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
        </Box>

        {/* Velocity Data */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SpeedIcon sx={{ mr: 1, color: theme.palette.error.main }} />
            Velocity
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {velocityData.map((item, index) => (
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
        </Box>

        {/* Educational Content */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.success.light}10, ${theme.palette.success.light}05)`,
            border: `1px solid ${theme.palette.success.light}20`
          }}
        >
          <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1, color: theme.palette.success.main }} />
            About ISS Visibility
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {/* Fixed section - using component="div" to allow block-level children */}
          <Typography variant="body2" component="div" paragraph>
            The International Space Station is visible when it's{' '}
            <Chip 
              label="more than 5° above the horizon" 
              size="small" 
              color="success"
              variant="outlined"
              sx={{ fontWeight: 'bold', display: 'inline-flex', verticalAlign: 'middle' }}
            />{' '}
            and reflects sunlight while your location is in darkness.
          </Typography>
          
          <List dense>
            {educationalFacts.map((fact, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 40, fontSize: '1.2rem' }}>
                  {fact.icon}
                </ListItemIcon>
                <ListItemText
                  primary={fact.text}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ISSCurrentPosition;