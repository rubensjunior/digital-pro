import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useTheme } from './composables/useTheme';

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

// Bootstrap Vue application
const app = createApp(App);

// Initialize visual theme layout system dynamically
const { initTheme } = useTheme();
initTheme();

app.use(router);
app.mount('#app');
