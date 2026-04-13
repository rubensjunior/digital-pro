import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';

// Declare the electronAPI type for TypeScript
declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<string>;
      windowMinimize: () => void;
      windowMaximize: () => void;
      windowClose: () => void;
      versions: {
        node: () => string;
        chrome: () => string;
        electron: () => string;
      }
    };
  }
}

// Update UI with Environment Versions
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  replaceText('node-version', window.electronAPI.versions.node());
  replaceText('chrome-version', window.electronAPI.versions.chrome());
  replaceText('electron-version', window.electronAPI.versions.electron());

  // Bind Window Controls
  const minBtn = document.getElementById('min-btn');
  const maxBtn = document.getElementById('max-btn');
  const closeBtn = document.getElementById('close-btn');

  if (minBtn) {
    minBtn.addEventListener('click', () => {
      window.electronAPI.windowMinimize();
    });
  }

  if (maxBtn) {
    maxBtn.addEventListener('click', () => {
      window.electronAPI.windowMaximize();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.electronAPI.windowClose();
    });
  }

  // Let's bind the Ping button
  const pingBtn = document.getElementById('ping-btn');
  const pingResponse = document.getElementById('ping-response');

  if (pingBtn && pingResponse) {
    pingBtn.addEventListener('click', async () => {
      pingResponse.innerText = 'Pinging...';
      try {
        const response = await window.electronAPI.ping();
        pingResponse.innerText = `Main Process says: ${response} 🏓`;
      } catch (err) {
        pingResponse.innerText = 'Error: could not reach main process!';
      }
    });
  }
});

