// main.jsx: punto de entrada de la aplicación React
// StrictMode activo → detecta efectos secundarios y doble render en desarrollo

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
