import React, { useEffect } from 'react';
import { useNotification } from '.../context/NotificationContext.js';  // Import the context

const Notification = () => {
  const { notification, hideNotification } = useNotification();
  const { type, message } = notification || {};

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        hideNotification();  // Hide notification after 5 seconds
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, hideNotification]);

  if (!notification) return null;  // Don't render anything if there's no notification

  const notificationStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    color: 'white',
    zIndex: 1000,
    animation: 'fadeIn 0.5s ease-in-out',
  };

  const successStyle = {
    ...notificationStyle,
    backgroundColor: '#28a745', // Green for success
  };

  const errorStyle = {
    ...notificationStyle,
    backgroundColor: '#dc3545', // Red for error
  };

  return (
    <div style={type === 'success' ? successStyle : errorStyle}>
      {message}
    </div>
  );
};

export default Notification;
