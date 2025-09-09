// src/components/PassNotification.jsx
import React, { useEffect, useState } from 'react';
import './PassNotification.css';

const PassNotification = ({ pass, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 10 minutes
    const timeout = setTimeout(() => {
      handleDismiss();
    }, 10 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(pass.startTime.getTime()), 300);
  };

  if (!visible) return null;

  return (
    <div className="notification-alert">
      <div className="notification-content">
        <span className="notification-icon">🔔</span>
        <div className="notification-text">
          <strong>Satellite pass starting soon!</strong>
          <div>Pass begins in 5 minutes. Max elevation: {pass.maxElevation}°</div>
        </div>
        <button 
          className="notification-dismiss"
          onClick={handleDismiss}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PassNotification;