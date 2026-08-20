import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// Browsers (mainly Chrome) try to restore the previous scroll position on a
// manual reload. Opting out and forcing scroll-to-top makes reload always
// land back at the page's actual start.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
