import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from '@/App';
import AppErrorBoundary from '@/components/common/boundary/AppErrorBoundary';
import AppErrorFallback from '@/components/common/boundary/AppErrorFallback';

import '@/styles/global.scss';

registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary
      fallback={({ reset }) => <AppErrorFallback onSecondaryAction={reset} />}
    >
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
