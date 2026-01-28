import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import config from 'devextreme/core/config'; 
import { licenseKey } from './devextreme-license'; 

import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import './scss/common.scss';
import './scss/style.scss';
import './fonts/fonts.css';
import App from './App.jsx'

config({ licenseKey });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
