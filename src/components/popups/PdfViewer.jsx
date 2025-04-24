import React from 'react';
import Popup from './Popup';

const PdfViewer = ({ isOpen, onClose, pdfUrl, title = "PDF Document" }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose} title={title} fullScreen={true}>
      <div className="pdf-viewer-container">
        <div className="pdf-document-container" style={{ height: '100%', width: '100%' }}>
          <iframe
            src={pdfUrl}
            title={title}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </Popup>
  );
};

export default PdfViewer;
