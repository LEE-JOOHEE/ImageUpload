import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Reset } from 'styled-reset'
import './css/font.css';
import './css/grid.css';
import './css/custom.css';

import { ImageProvider } from './context/ImageContext'
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Reset />
    <BrowserRouter>
      <AuthProvider>
        <ImageProvider>
          <App />
        </ImageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
