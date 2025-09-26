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
  Visibility as VisibilityIcon,
  NotInterested as NotVisibleIcon,
  TrendingUp as TrendingIcon,
  Navigation as NavigationIcon,
  DarkMode as DarkModeIcon,
  RemoveRedEye as EyeIcon,
  Schedule as ScheduleIcon,
  Smartphone as PhoneIcon
} from '@mui/icons-material';
import AzimuthGuide from './AzimuthGuide';
import { getSimpleDirection, getArrowIcon } from '../utils/directionUtils';

const VisibilityStatus = ({ isVisible, issPosition, elevation }) => {
  const theme = useTheme();
  const direction = getSimpleDirection(issPosition?.azimuth);
  const arrowIcon = getArrowIcon(issPosition?.azimuth);
  const azimuthValue = issPosition?.azimuth?.toFixed(1);

  // Visibility theme
  const visibilityTheme = isVisible
    ? {
        title: 'ISS IS VISIBLE NOW!',
        subtitle: `Look ${direction}! ${arrowIcon} You might see it!`,
        color: theme.palette.success.main,
        bgColor: theme.palette.success.light,
        icon: '🔭',
        status: 'Visible',
        severity: 'success'
      }
    : {
        title: 'ISS Not Currently Visible',
        subtitle: 'Wait for the next pass to see the International Space Station',
        color: theme.palette.warning.main,
        bgColor: theme.palette.warning.light,
        icon: '🌌',
        status: 'Not Visible',
        severity: 'warning'
      };

  // Stats data
  const stats = [
    {
      icon: <TrendingIcon color="primary" />,
      label: 'Current Elevation',
      value: `${elevation.toFixed(1)}°`,
      color: theme.palette.primary.main
    },
    ...(issPosition?.azimuth ? [{
      icon: <NavigationIcon color="secondary" />,
      label: 'Direction',
      value: `${direction} ${arrowIcon}`,
      color: theme.palette.secondary.main
    }] : []),
  ];

  // Viewing tips
  const viewingTips = isVisible ? [
    { icon: <DarkModeIcon />, text: 'Find a dark location away from city lights' },
    { icon: <EyeIcon />, text: 'No telescope needed - visible to naked eye' },
    { icon: <ScheduleIcon />, text: 'Typically visible for 2-6 minutes' },
    { icon: <PhoneIcon />, text: 'Use the direction guide to know where to look' }
  ] : [];

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
            🌍 Visibility Status
          </Typography>
        }
        subheader="Real-time ISS visibility information"
      />
      
      <CardContent>
        {/* Main Visibility Banner */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${visibilityTheme.bgColor}20, ${visibilityTheme.bgColor}40)`,
            border: `2px solid ${visibilityTheme.bgColor}30`,
            borderRadius: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated background effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${visibilityTheme.color}30, ${visibilityTheme.color}70, ${visibilityTheme.color}30)`,
              animation: 'shimmer 3s ease-in-out infinite'
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: visibilityTheme.bgColor,
                color: visibilityTheme.color,
                mr: 2,
                width: 48,
                height: 48
              }}
            >
              {isVisible ? <VisibilityIcon /> : <NotVisibleIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" color={visibilityTheme.color} fontWeight="bold">
                {visibilityTheme.title}
              </Typography>
              <Chip 
                label={visibilityTheme.status} 
                size="small" 
                color={visibilityTheme.severity}
                variant="filled"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {visibilityTheme.subtitle}
          </Typography>

          {isVisible && azimuthValue && (
            <Chip
              label={`Azimuth: ${azimuthValue}° ${arrowIcon}`}
              variant="outlined"
              sx={{
                borderColor: visibilityTheme.color,
                color: visibilityTheme.color,
                fontWeight: 'medium',
                background: `${visibilityTheme.color}10`
              }}
            />
          )}
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${stat.color}10, ${stat.color}05)`,
                  border: `1px solid ${stat.color}20`
                }}
              >
                <Box sx={{ mr: 2, color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" color="text.primary" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Azimuth Guide */}
        {isVisible && (
          <Box sx={{ mb: 3 }}>
            <AzimuthGuide azimuth={issPosition?.azimuth} />
          </Box>
        )}

        {/* Viewing Tips */}
        {viewingTips.length > 0 && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.info.light}10, ${theme.palette.info.light}05)`,
              border: `1px solid ${theme.palette.info.light}20`
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <EyeIcon sx={{ mr: 1, color: theme.palette.info.main }} />
              Viewing Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {viewingTips.map((tip, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: theme.palette.info.main }}>
                    {tip.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={tip.text}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </CardContent>

      {/* Add CSS animation for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Card>
  );
};

export default VisibilityStatus;