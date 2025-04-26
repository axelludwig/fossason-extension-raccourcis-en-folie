import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private ipc = window.require ? window.require('electron').ipcRenderer : null;

  constructor() { }

  openPopup() {
    if (this.ipc) {
      this.ipc.send('open-popup');
    }
  }
}
