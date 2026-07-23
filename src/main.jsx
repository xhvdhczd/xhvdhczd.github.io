import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeModeProvider } from './theme/ThemeModeProvider.jsx';
import App from './App.jsx';
import './index.css';

// Application entry point.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ThemeModeProvider>
        <App />
      </ThemeModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
