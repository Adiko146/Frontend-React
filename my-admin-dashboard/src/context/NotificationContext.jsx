import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {message && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "green",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px"
        }}>
          {message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);