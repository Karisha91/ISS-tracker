// src/components/PassPredictions.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Grid 
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Navigation as NavigationIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { calculatePassPredictions, formatPassTime, getTimeUntil } from '../utils/passPredictionUtils';
import PassNotification from './PassNotification';

const PassPredictions = ({ satrec, observerLocation }) => {
  const theme = useTheme();
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [scheduledNotifications, setScheduledNotifications] = useState(new Set());
  const notificationTimeouts = useRef({});

  // Calculate passes when component mounts or data changes
  useEffect(() => {
    if (satrec && observerLocation) {
      try {
        setIsLoading(true);
        const predictions = calculatePassPredictions(satrec, observerLocation, 3); // 3 days ahead
        setPasses(predictions);
        setError(null);
      } catch (err) {
        setError('Failed to calculate pass predictions');
        console.error('Pass prediction error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [satrec, observerLocation]);

  // Set up notifications for scheduled passes
  useEffect(() => {
    // Clear any existing timeouts
    Object.values(notificationTimeouts.current).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    notificationTimeouts.current = {};
    
    // Set new notifications for each scheduled pass
    passes.forEach(pass => {
      const passId = pass.startTime.getTime();
      
      if (scheduledNotifications.has(passId)) {
        const notificationTime = new Date(pass.startTime.getTime() - 5 * 60 * 1000); // 5 minutes before
        const now = new Date();
        
        // Only set notification if it's in the future
        if (notificationTime > now) {
          const timeUntilNotification = notificationTime - now;
          
          notificationTimeouts.current[passId] = setTimeout(() => {
            // Show notification
            setActiveNotifications(prev => [...prev, pass]);
            
            // Check if browser supports notifications
            if ('Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification('Satellite Pass Alert', {
                  body: `A satellite pass will begin in 5 minutes! Maximum elevation: ${pass.maxElevation}°`,
                  icon: '/satellite-icon.png'
                });
              } else if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    new Notification('Satellite Pass Alert', {
                      body: `A satellite pass will begin in 5 minutes! Maximum elevation: ${pass.maxElevation}°`,
                      icon: '/satellite-icon.png'
                    });
                  }
                });
              }
            }
          }, timeUntilNotification);
        }
      }
    });
    
    // Cleanup function to clear timeouts
    return () => {
      Object.values(notificationTimeouts.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, [passes, scheduledNotifications]);

  // Request notification permission when component mounts
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Add notification for a specific pass
  const addNotification = (passId) => {
    setScheduledNotifications(prev => new Set([...prev, passId]));
  };

  // Remove notification for a specific pass
  const removeNotification = (passId) => {
    setScheduledNotifications(prev => {
      const newSet = new Set([...prev]);
      newSet.delete(passId);
      return newSet;
    });
    
    // Also clear the timeout if it exists
    if (notificationTimeouts.current[passId]) {
      clearTimeout(notificationTimeouts.current[passId]);
      delete notificationTimeouts.current[passId];
    }
  };

  // Dismiss notification
  const dismissNotification = (passId) => {
    setActiveNotifications(prev => 
      prev.filter(pass => pass.startTime.getTime() !== passId)
    );
  };

  // Get pass quality based on elevation
  const getPassQuality = (elevation) => {
    if (elevation >= 60) return 'Excellent';
    if (elevation >= 30) return 'Good';
    if (elevation >= 15) return 'Fair';
    return 'Poor';
  };

  // Get quality color
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Excellent': return theme.palette.success.main;
      case 'Good': return theme.palette.info.main;
      case 'Fair': return theme.palette.warning.main;
      case 'Poor': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  // Get quality icon
  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'Excellent': return '⭐';
      case 'Good': return '👍';
      case 'Fair': return '👀';
      case 'Poor': return '📡';
      default: return '🛰️';
    }
  };

  if (isLoading) {
    return (
      <Card 
        elevation={3}
        sx={{
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1e293b 0%, #1a2436 100%)'
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" component="h2" fontWeight="bold">
              📅 Upcoming Passes
            </Typography>
          }
          subheader="Calculating satellite pass predictions"
        />
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Calculating pass predictions...
            </Typography>
            <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        elevation={3}
        sx={{
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1e293b 0%, #1a2436 100%)'
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" component="h2" fontWeight="bold">
              📅 Upcoming Passes
            </Typography>
          }
          subheader="Satellite pass predictions"
        />
        <CardContent>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <Typography variant="body1">{error}</Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (passes.length === 0) {
    return (
      <Card 
        elevation={3}
        sx={{
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1e293b 0%, #1a2436 100%)'
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" component="h2" fontWeight="bold">
              📅 Upcoming Passes
            </Typography>
          }
          subheader="Satellite pass predictions"
        />
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No visible passes in the next 3 days
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      elevation={3}
      sx={{
        borderRadius: 2,
        background: 'linear-gradient(135deg, #1e293b 0%, #1a2436 100%)'
      }}
    >
      <CardHeader
        title={
          <Typography variant="h5" component="h2" fontWeight="bold">
            📅 Upcoming Passes
          </Typography>
        }
        subheader={`Next 3 days • ${passes.length} visible passes`}
      />
      
      <CardContent>
        {/* Notification alerts */}
        {activeNotifications.map((pass, index) => (
          <PassNotification
            key={pass.startTime.getTime()}
            pass={pass}
            onDismiss={dismissNotification}
          />
        ))}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Next 5 Passes
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Box>

        {passes.slice(0, 5).map((pass, index) => {
          const passId = pass.startTime.getTime();
          const quality = getPassQuality(pass.maxElevation);
          const qualityColor = getQualityColor(quality);
          const isNotificationScheduled = scheduledNotifications.has(passId);
          
          return (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${qualityColor}10, ${qualityColor}05)`,
                border: `1px solid ${qualityColor}20`
              }}
            >
              {/* Pass Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1, color: qualityColor }} />
                  <Typography variant="h6" fontWeight="bold">
                    {formatPassTime(pass.startTime)} → {formatPassTime(pass.endTime)}
                  </Typography>
                </Box>
                <Chip
                  label={quality}
                  size="small"
                  sx={{ 
                    backgroundColor: qualityColor,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  icon={<span>{getQualityIcon(quality)}</span>}
                />
              </Box>

              {/* Pass Details Grid */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        When
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {getTimeUntil(pass.startTime)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Peak Elevation
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pass.maxElevation}°
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pass.duration} minutes
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <NavigationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Direction
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {pass.direction}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Elevation Visualization */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Horizon
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overhead
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(100, pass.maxElevation * 1.2)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.palette.grey[800],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: qualityColor,
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              {/* Notification Button */}
              <Box sx={{ textAlign: 'center' }}>
                {isNotificationScheduled ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<NotificationsOffIcon />}
                    onClick={() => removeNotification(passId)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Remove Notification
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<NotificationsIcon />}
                    onClick={() => addNotification(passId)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                    }}
                  >
                    Notify 5 Minutes Before
                  </Button>
                )}
              </Box>
            </Paper>
          );
        })}

        {passes.length > 5 && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.info.light}10, ${theme.palette.info.light}05)`,
              border: `1px solid ${theme.palette.info.light}20`
            }}
          >
            <Typography variant="body1" color="text.secondary">
              +{passes.length - 5} more passes in the next 3 days
            </Typography>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default PassPredictions;