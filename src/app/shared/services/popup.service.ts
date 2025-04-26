import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor() { }

  openAccountPopup() {
    console.log('Opening popup...');
    if ((window as any).electronAPI) {
      (window as any).electronAPI.openAccountPopup();
    } else {
      console.error('Electron API non disponible');
    }
  }
}
