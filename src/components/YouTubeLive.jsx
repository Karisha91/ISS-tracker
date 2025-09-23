
import React from 'react';
import './YouTubeLive.css';

const YouTubeLive = () => {
  const videoId = "fO9e9jnhYK8"; 

  return (
    <div className="youtube-live-card">
      <h2>🌍 ISS Live Stream</h2>
      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="ISS Live Stream"
          className="youtube-iframe"
        ></iframe>
      </div>
      <div className="video-info">
        <p>Live footage from the International Space Station</p>
        <div className="stream-status">
          <span className="live-indicator">● LIVE</span>
          <span className="status-note">Stream may be offline during orbital night</span>
        </div>
        <a 
          href={`https://www.youtube.com/watch?v=${videoId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="youtube-link"
        >
          Watch on YouTube ↗
        </a>
      </div>
    </div>
  );
};

export default YouTubeLive;