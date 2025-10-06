// src/global.d.ts
export {};

declare global {
  interface Window {
    api: {
      loadConfig: () => Promise<any>;
      watchLogs: (folder: string, filters: { Video: boolean; Image: boolean; String: boolean }) => void;
      onNewLogs: (callback: (logs: { time: string; url: string; type: 'Video' | 'Image' | 'String' }[]) => void) => void;
    };
  }
}
