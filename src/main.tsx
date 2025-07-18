import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Aqui precisa importar seu App.tsx
import './i18n'; // para ativar traduções

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />  {/* Aqui é onde o CRM recebe as props */}
  </React.StrictMode>
);
