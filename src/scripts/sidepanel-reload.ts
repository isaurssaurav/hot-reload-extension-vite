import { HOT_RELOAD_EXTENSION_VITE_PORT, Message } from '../utils';
/**
 * If development, this code will be appended to sidepanel script file.
 */

/** Initializes or re-initializes a WebSocket connection to the Hot-Reload-Extension Server */
const startWebSocket = () => {
  const socket = new WebSocket(`ws://localhost:${HOT_RELOAD_EXTENSION_VITE_PORT}`);

  socket.addEventListener('open', () => {});

  socket.addEventListener('message', (event) => {
    if (event.data === Message.FILE_CHANGE) {
      window.location.reload();
    }
  });

  socket.addEventListener('close', () => {
    setTimeout(startWebSocket, 1000);
  });
};

startWebSocket();
