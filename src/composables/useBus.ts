import { reactive } from 'vue';

type Callback = (...args: any[]) => void;
const listeners: Record<string, Callback[]> = {};

export function useBus() {
  const on = (event: string, callback: Callback) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  };

  const off = (event: string, callback: Callback) => {
    if (!listeners[event]) return;
    const idx = listeners[event].indexOf(callback);
    if (idx > -1) listeners[event].splice(idx, 1);
  };

  const emit = (event: string, ...args: any[]) => {
    if (!listeners[event]) return;
    listeners[event].forEach(cb => cb(...args));
  };

  return { on, off, emit };
}
