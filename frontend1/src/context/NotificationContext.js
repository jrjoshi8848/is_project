import React, { createContext, useContext, useState } from 'react';

// Create Notification Context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification Provider component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);  // Store notification state

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
