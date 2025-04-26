import { Injectable } from '@angular/core';

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
