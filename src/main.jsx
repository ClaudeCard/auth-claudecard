import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const params = new URLSearchParams(window.location.search);
const redirectPath = params.get('p');
if (redirectPath) window.history.replaceState(null, '', redirectPath);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
