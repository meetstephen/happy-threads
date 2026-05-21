import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CustomDesignsProvider } from './context/CustomDesignsContext';
import { SiteContentProvider } from './context/SiteContentContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SiteContentProvider>
        <CustomDesignsProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </CustomDesignsProvider>
      </SiteContentProvider>
    </ThemeProvider>
  </React.StrictMode>
);
