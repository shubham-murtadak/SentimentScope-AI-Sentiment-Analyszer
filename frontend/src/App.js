import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import SentimentChart from './components/SentimentChart';
import axios from 'axios';

import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config';

import apiBaseUrl from './config'; // Import the API base URL
import './styles.css';  // Global styles
import './components/Auth.css';  // Component-specific styles

function App() {
  const [chartData, setChartData] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Track authenticated user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login'); // Toggle between login and signup

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadSuccess = (file) => {
    setFileUploaded(true);
    setUploadedFile(file);
  };

  const handleAnalyzeSentiment = async () => {
    setLoading(true);
    try {
      if (!uploadedFile) throw new Error('No file uploaded for sentiment analysis');

      const formData = new FormData();
      formData.append('file', uploadedFile);

      // Use apiBaseUrl for the API call
      const response = await axios.post(`${apiBaseUrl}sentimentanalysis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.results) {
        setChartData(response.data.results);
      } else {
        throw new Error('Invalid response format from the backend');
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to analyze sentiment!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setChartData(null);
    setFileUploaded(false);
    setUploadedFile(null);
  };

  // Authentication Handlers
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login Error:', error.message);
      alert('Failed to login');
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Signup Error:', error.message);
      alert('Failed to sign up');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">SentimentScope 🚀</div>
        <ul className="navbar-links">
          <li><a href="#" onClick={handleGoBack}>Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact Us</a></li>
          {user ? (
            <li><button onClick={handleLogout} className="navbar-button">Logout</button></li>
          ) : (
            <li>
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} 
                className="navbar-button"
              >
                {authMode === 'login' ? 'Signup' : 'Login'}
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="content-container">
        {/* Authentication Section */}
        {!user && (
          <div className="auth-container">
            <h2>{authMode === 'login' ? 'Login' : 'Signup'}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
            <button onClick={authMode === 'login' ? handleLogin : handleSignup} className="auth-button">
              {authMode === 'login' ? 'Login' : 'Signup'}
            </button>
          </div>
        )}

        {/* Main Content for Authenticated Users */}
        {user && (
          <>
            {!chartData && !loading && (
              <div className="file-upload-container">
                <FileUpload onUploadSuccess={handleUploadSuccess} />
                {fileUploaded && (
                  <button onClick={handleAnalyzeSentiment} disabled={loading} className="analyze-button">
                    {loading ? 'Analyzing Sentiment...' : 'Analyze Sentiment'}
                  </button>
                )}
              </div>
            )}

            {/* Display Sentiment Chart */}
            {chartData && (
              <div className="chart-container">
                <SentimentChart sentimentData={chartData} />
              </div>
            )}

            {/* Loading State */}
            {loading && <div className="loading">Analyzing sentiment...</div>}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 SentimentScope 🚀. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
