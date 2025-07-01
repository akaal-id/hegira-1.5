import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HegiraApp from './HegiraApp';

async function initializeApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <HegiraApp />
    </StrictMode>
  );
}

initializeApp().catch(console.error);