import React, { useEffect } from "react";

const MessageAlert = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        onClose();
      }, 3000); // Auto dismiss after 3 sec
      return () => clearTimeout(timeout);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`alert alert-${type} m-3`} role="alert">
      {message}
    </div>
  );
};

export default MessageAlert;
