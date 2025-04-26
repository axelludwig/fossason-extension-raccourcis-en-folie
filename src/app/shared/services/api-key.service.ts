import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electronAPI: {
      getApiKey: () => Promise<string | null>;
      setApiKey: (key: string) => Promise<void>;
      openAccountPage: (callback: () => void) => void;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {

  constructor() { }

  getApiKey(): Promise<string | null> {
    return window.electronAPI.getApiKey();
  }

  setApiKey(key: string): Promise<void> {
    return window.electronAPI.setApiKey(key);
  }
}
