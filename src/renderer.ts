import './index.css';

// Declare the electronAPI type for TypeScript
declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<string>;
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

