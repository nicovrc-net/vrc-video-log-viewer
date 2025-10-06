import { contextBridge } from 'electron';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import yaml from 'js-yaml';

contextBridge.exposeInMainWorld('api', {
  loadConfig: async () => {
    const configPath = path.join(__dirname, '../config.yml');
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      return yaml.load(content);
    } catch {
      return {};
    }
  },
  watchLogs: (folder, filters) => {
    const watcher = chokidar.watch(folder, { ignoreInitial: true });
    watcher.on('add', (filePath) => {
      // 新しいログファイル追加時の処理
    });
  },
  onNewLogs: (callback) => {
    // Renderer と通信するためのダミー関数
  }
});
