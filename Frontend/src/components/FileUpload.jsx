import React, { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [reportMetadata, setReportMetadata] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process the file');
      }

      const data = await response.json();
      setReportMetadata(data.report_metadata);
      setResponseMessage('File processed successfully!');
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Failed to upload the file.');
    }
  };

  return (
    <div className="file-upload-card">
      <h1 className="file-upload-title">Upload PBIX File</h1>
      <input
        type="file"
        accept=".pbix"
        onChange={handleFileChange}
        className="file-upload-input"
      />
      <button onClick={handleSubmit} className="file-upload-button">
        Upload
      </button>
      {responseMessage && <p className="file-upload-response">{responseMessage}</p>}

      {reportMetadata && (
        <div className="report-metadata">
          <h2>📁 Report Metadata</h2>
          <p><strong>Report Theme:</strong> {reportMetadata.theme}</p>
          <p><strong>Report Version:</strong> {reportMetadata.version}</p>

          <h2>📄 Report Pages</h2>
          {reportMetadata.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="report-page">
              <h3>📘 Page {page.page_number}: {page.page_name}</h3>
              <p><strong>Visuals on this page:</strong> {page.visuals.length}</p>

              {page.visuals.map((visual, visualIndex) => (
                <div key={visualIndex} className="report-visual">
                  <h4>🔲 Visual {visual.visual_number}</h4>
                  <p><strong>Position:</strong> (x: {visual.position.x}, y: {visual.position.y}), Size: {visual.position.width} x {visual.position.height}</p>
                  <p><strong>Visual Type:</strong> {visual.visual_type}</p>

                  {Object.keys(visual.projections).length > 0 && (
                    <div>
                      <p><strong>🎯 Projections:</strong></p>
                      <ul>
                        {Object.entries(visual.projections).map(([role, fields], roleIndex) => (
                          <li key={roleIndex}>
                            <strong>{role}:</strong> {fields.join(', ')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {visual.query_fields.length > 0 && (
                    <p><strong>🧮 Query Fields:</strong> {visual.query_fields.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
          <p><strong>Report Suggestions:</strong> {reportMetadata.suggestions}</p>
        </div>
      )}
    </div>
  );
}