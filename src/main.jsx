import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import 'remixicon/fonts/remixicon.css';
import { NotificationProvider } from './context/NotificationContext.jsx';
import NotificationToast from './components/Notification/NotificationToast.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <App />
      <NotificationToast />
    </NotificationProvider>
  </StrictMode>
);
