import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// styles
import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './scss/common.scss';
import './scss/style.scss';
import './fonts/fonts.css';

// app
import App from './App.jsx'

// devextreme
import config from 'devextreme/core/config';
import { licenseKey } from './devextreme-license';
import koMessages from './components/devextreme/ko.json';
import { locale, loadMessages } from 'devextreme/localization';

config({ licenseKey });
loadMessages(koMessages);
locale('ko');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
