<<<<<<< HEAD
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import HegiraApp from './HegiraApp'; // Corrected import path

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HegiraApp /> {/* Component name is HegiraApp, matching export */}
    </React.StrictMode>
  );
} else {
  console.error("Root element 'root' not found in the DOM.");
}
=======
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
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
