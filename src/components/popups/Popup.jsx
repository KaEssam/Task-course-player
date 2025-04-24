import React, { useEffect } from 'react';

const Popup = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      const handleEscKey = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <h3>{title}</h3>
          <button className="popup-close" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>
        <div className="popup-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
