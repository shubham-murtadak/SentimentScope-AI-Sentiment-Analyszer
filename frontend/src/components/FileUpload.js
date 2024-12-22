import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true);  // Set loading to true when uploading starts

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the file to the backend
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Inform the user that the file was successfully uploaded
      alert('File uploaded successfully!');
      onUploadSuccess(file);  // ✅ Pass the file object instead of file.name
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file!');
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload CSV File</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="file-input"
      />
      <div className="buttons-container">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="upload-button"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
