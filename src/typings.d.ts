/* SystemJS module definition */
declare const nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  process: any;
  require: any;
}

// src/typings.d.ts
export interface ElectronAPI {
  onMediaPlayPause(cb: (_: any, args?: any) => void): void;
  onMediaNext(cb: (_: any, args?: any) => void): void;
  onMediaPrev(cb: (_: any, args?: any) => void): void;
  onVolumeUp(cb: (_: any, args?: any) => void): void;
  onVolumeDown(cb: (_: any, args?: any) => void): void;
  onVolumeMute(cb: (_: any, args?: any) => void): void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};