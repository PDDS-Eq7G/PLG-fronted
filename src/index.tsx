import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // 👈 necesario
import { ConfigProvider } from './context/ConfigurationContext';
import { SimulacionProvider } from './context/SimulacionContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter> 
      <ConfigProvider>
        <SimulacionProvider>
          <App />
        </SimulacionProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
