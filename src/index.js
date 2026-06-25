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

const globalFontStyle = document.createElement('style');
globalFontStyle.textContent = `
  html, body, #root, *, *::before, *::after {
    font-family: ${APP_FONT_STACK} !important;
  }

  html, body, #root {
    color: #111827;
    background: #f7faff;
  }

  body {
    font-weight: 400;
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${APP_FONT_STACK} !important;
    color: #0f172a;
    margin: 0;
  }

  h1 {
    font-size: 26px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: 15px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: 0;
  }

  p {
    line-height: 1.6;
    color: #64748b;
    margin: 0;
  }

  strong, b {
    font-weight: 700;
  }

  table {
    font-family: ${APP_FONT_STACK} !important;
    font-size: 13px !important;
    line-height: 1.45;
    color: #111827;
    border-collapse: collapse;
  }

  th {
    font-family: ${APP_FONT_STACK} !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  td {
    font-family: ${APP_FONT_STACK} !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    line-height: 1.45;
  }

  button, input, select, textarea {
    font: inherit;
  }
`;
document.head.appendChild(globalFontStyle);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
