import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Link,
  useTheme
} from '@mui/material';
import {
  LiveTv as LiveTvIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

const YouTubeLive = () => {
  const theme = useTheme();
  const videoId = "fO9e9jnhYK8";

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
            🌍 ISS Live Stream
          </Typography>
        }
        subheader="Live footage from the International Space Station"
        action={
          <Chip
            icon={<LiveTvIcon />}
            label="LIVE"
            color="error"
            variant="filled"
            sx={{
              fontWeight: 'bold',
              animation: 'pulse 2s infinite'
            }}
          />
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center'
          }
        }}
      />
      
      <CardContent>
        {/* Video Container */}
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            mb: 2,
            border: `2px solid ${theme.palette.error.main}40`
          }}
        >
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="ISS Live Stream"
            />
          </Box>
        </Paper>

        {/* Stream Info */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.info.light}10, ${theme.palette.info.light}05)`,
            border: `1px solid ${theme.palette.info.light}20`,
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScheduleIcon sx={{ mr: 1, color: theme.palette.info.main }} />
            <Typography variant="h6" component="h3" fontWeight="medium">
              Stream Information
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Live HD footage from the International Space Station's external cameras. 
            The stream may be temporarily offline during orbital night (approximately 45 minutes of each 90-minute orbit).
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="HD Quality"
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label="Real-time"
              size="small"
              color="success"
              variant="outlined"
            />
            <Chip
              label="NASA TV"
              size="small"
              color="warning"
              variant="outlined"
            />
          </Box>
        </Paper>

        {/* Stream Status */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.warning.light}10, ${theme.palette.warning.light}05)`,
            border: `1px solid ${theme.palette.warning.light}20`,
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.error.main,
                  mr: 1,
                  animation: 'pulse 2s infinite'
                }}
              />
              <Typography variant="body1" fontWeight="medium" color="error.main">
                Live Now
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Stream may be offline during orbital night (when ISS is in Earth's shadow)
          </Typography>
        </Paper>

        {/* Action Button */}
        <Button
          component={Link}
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          fullWidth
          startIcon={<PlayArrowIcon />}
          endIcon={<OpenInNewIcon />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1.1rem',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.dark})`,
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Watch on YouTube
        </Button>

        {/* Footer Note */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 2,
            fontStyle: 'italic'
          }}
        >
          Provided by NASA's Live ISS Stream
        </Typography>
      </CardContent>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default YouTubeLive;