import React from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './Sidebar';
import styles from '../style.css?inline';

const rootId = 'input-bridge-root';

function init() {
  if (document.getElementById(rootId)) return;

  const rootHost = document.createElement('div');
  rootHost.id = rootId;
  document.body.appendChild(rootHost);

  const shadowRoot = rootHost.attachShadow({ mode: 'open' });
  
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  shadowRoot.appendChild(styleElement);

  const rootContainer = document.createElement('div');
  shadowRoot.appendChild(rootContainer);

  const root = createRoot(rootContainer);
  root.render(
    <React.StrictMode>
      <Sidebar />
    </React.StrictMode>
  );
}

init();
