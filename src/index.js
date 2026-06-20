import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { APP_FONT_STACK } from './components/UI';

document.documentElement.style.height = '100%';
document.documentElement.style.margin = '0';
document.documentElement.style.overflow = 'hidden';
document.documentElement.style.fontFamily = APP_FONT_STACK;
document.documentElement.style.WebkitFontSmoothing = 'antialiased';
document.documentElement.style.MozOsxFontSmoothing = 'grayscale';
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.fontFamily = APP_FONT_STACK;
document.body.style.WebkitFontSmoothing = 'antialiased';
document.body.style.MozOsxFontSmoothing = 'grayscale';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
