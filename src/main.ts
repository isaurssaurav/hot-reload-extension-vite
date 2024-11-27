import type { Plugin } from 'vite';
import { resolve } from 'path';
import WebSocket from 'ws';
import fs from 'fs';
import { initAndListenConnection } from './utils/websocket';
import { Message, PLUGIN_NAME, chalkLogger, isDev } from './utils';

export type hotReloadExtensionOptions = {
  backgroundPath?: string;
  sidepanelPath?: string;
  log?: boolean;
};

const hotReloadExtension = (options: hotReloadExtensionOptions): Plugin => {
  const { log, backgroundPath, sidepanelPath } = options;
  let ws: WebSocket | null = null;

  if (isDev) {
    initAndListenConnection((websocket) => {
      ws = websocket;
      if (log) {
        chalkLogger.green('Client connected! Ready to reload...');
      }
    });
  }

  return {
    name: PLUGIN_NAME,
    async transform(code: string, id: string) {
      console.log('🚀 ~ transform ~ id:', id);
      if (!isDev) {
        return;
      }

      if (!backgroundPath && !sidepanelPath) {
        chalkLogger.red(
          'Target file missing! Please, specify either `backgroundPath` or `sidepanelPath` in the plugin options'
        );
      }

      if (backgroundPath && id.includes(backgroundPath)) {
        const buffer = fs.readFileSync(resolve(__dirname, 'scripts/background-reload.js'));
        return {
          code: code + buffer.toString()
        };
      }

      if (sidepanelPath && id.includes(sidepanelPath)) {
        const buffer = fs.readFileSync(resolve(__dirname, 'scripts/sidepanel-reload.js'));
        return {
          code: code + buffer.toString()
        };
      }
    },
    async closeBundle() {
      if (!isDev) {
        return;
      }

      if (!ws) {
        chalkLogger.red('Load extension to browser...');
        return;
      }
      setTimeout(() => {
        ws?.send(Message.FILE_CHANGE);
        if (log) chalkLogger.green('Extension Reloaded...');
      }, 1000);
    }
  };
};

export default hotReloadExtension;
