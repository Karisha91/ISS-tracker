// src/components/PassPredictions.jsx
import React, { useState, useEffect } from 'react';
import { calculatePassPredictions, formatPassTime, getTimeUntil } from '../utils/passPredictionUtils';
import './PassPredictions.css';

const PassPredictions = ({ satrec, observerLocation }) => {
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Get pass quality based on elevation
  const getPassQuality = (elevation) => {
    if (elevation >= 60) return 'excellent';
    if (elevation >= 30) return 'good';
    if (elevation >= 15) return 'fair';
    return 'poor';
  };

  // Get quality color
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return '#27ae60';
      case 'good': return '#2ecc71';
      case 'fair': return '#f39c12';
      case 'poor': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (isLoading) {
    return (
      <div className="pass-predictions-card">
        <h2>📅 Upcoming Passes</h2>
        <div className="loading-passes">Calculating pass predictions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pass-predictions-card">
        <h2>📅 Upcoming Passes</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (passes.length === 0) {
    return (
      <div className="pass-predictions-card">
        <h2>📅 Upcoming Passes</h2>
        <div className="no-passes">No visible passes in the next 3 days</div>
      </div>
    );
  }

  return (
    <div className="pass-predictions-card">
      <h2>📅 Upcoming Passes</h2>
      <p className="pass-subtitle">Next 3 days • {passes.length} visible passes</p>
      
      <div className="passes-list">
        {passes.slice(0, 5).map((pass, index) => {
          const quality = getPassQuality(pass.maxElevation);
          const qualityColor = getQualityColor(quality);
          
          return (
            <div key={index} className="pass-item">
              <div className="pass-header">
                <span className="pass-time">
                  {formatPassTime(pass.startTime)} → {formatPassTime(pass.endTime)}
                </span>
                <span 
                  className="pass-quality"
                  style={{ backgroundColor: qualityColor }}
                >
                  {quality}
                </span>
              </div>
              
              <div className="pass-details">
                <div className="pass-detail">
                  <span className="detail-label">⏱️ When:</span>
                  <span className="detail-value">{getTimeUntil(pass.startTime)}</span>
                </div>
                
                <div className="pass-detail">
                  <span className="detail-label">📈 Peak:</span>
                  <span className="detail-value">{pass.maxElevation}° elevation</span>
                </div>
                
                <div className="pass-detail">
                  <span className="detail-label">⏰ Duration:</span>
                  <span className="detail-value">{pass.duration} minutes</span>
                </div>
                
                <div className="pass-detail">
                  <span className="detail-label">🧭 Direction:</span>
                  <span className="detail-value">{pass.direction}</span>
                </div>
              </div>
              
              <div className="pass-visibility">
                <div className="visibility-bar">
                  <div 
                    className="visibility-fill"
                    style={{ 
                      width: `${Math.min(100, pass.maxElevation * 1.2)}%`,
                      backgroundColor: qualityColor
                    }}
                  ></div>
                </div>
                <div className="visibility-labels">
                  <span>Horizon</span>
                  <span>Overhead</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {passes.length > 5 && (
        <div className="more-passes">
          +{passes.length - 5} more passes in the next 3 days
        </div>
      )}
    </div>
  );
};

export default PassPredictions;