import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.documentElement.style.height = '100%';
document.documentElement.style.margin = '0';
document.documentElement.style.overflow = 'hidden';
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);