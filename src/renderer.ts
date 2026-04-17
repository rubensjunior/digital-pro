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
      };
      // ─── Brain Vault ───────────────────────────────────────────────────
      ideias: {
        getAll: () => Promise<import('./types/ideia').IdeiaRaw[]>;
        create: (payload: Record<string, unknown>) => Promise<import('./types/ideia').IdeiaRaw>;
        update: (payload: Record<string, unknown>) => Promise<import('./types/ideia').IdeiaRaw>;
        delete: (id: string) => Promise<boolean>;
        updateStatus: (id: string, status: string) => Promise<boolean>;
      };
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
