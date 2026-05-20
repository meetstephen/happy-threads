import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CustomDesignsProvider } from './context/CustomDesignsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CustomDesignsProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CustomDesignsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
