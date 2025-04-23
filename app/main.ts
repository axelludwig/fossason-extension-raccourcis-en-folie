import { app, BrowserWindow, screen, Tray, Menu, globalShortcut } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let win: BrowserWindow | null = null;
let tray: Tray | null = null;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

/**
 * Enregistre les media keys, logge l'événement et envoie un IPC au renderer
 */
function registerMediaKeys(window: BrowserWindow) {
  const mappings: { [accelerator: string]: string } = {
    'MediaPlayPause':     'media-play-pause',
    'MediaNextTrack':     'media-next',
    'MediaPreviousTrack': 'media-prev',
    'VolumeUp':           'volume-up',
    'VolumeDown':         'volume-down',
    'VolumeMute':         'volume-mute',
  };

  for (const accel of Object.keys(mappings)) {
    const channel = mappings[accel];
    globalShortcut.register(accel, () => {
      console.log(`Media key pressed: ${accel}`);
      if (!window.isDestroyed()) {
        window.webContents.send(channel);
      }
    });
  }
}

// Crée la fenêtre principale
function createWindow(): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    webPreferences: {
      // Passage en mode sécurisé preload + contextIsolation
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      allowRunningInsecureContent: serve,
    },
  });

  if (serve) {
    // Mode développement
    const debug = require('electron-debug');
    debug();
    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Mode production : charger le build Angular
    let indexPath = './index.html';
    const distPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(distPath)) {
      indexPath = '../dist/index.html';
    }
    win.loadURL(`file://${path.join(__dirname, indexPath)}`);
  }

  win.on('closed', () => {
    win = null;
  });

  return win;
}

// Crée l’icône Tray
function createTray() {
  const iconPath = path.join(__dirname, '../src/assets/tray-icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Afficher la fenêtre', click: () => win?.show() },
    { label: 'Masquer la fenêtre',  click: () => win?.hide() },
    { type: 'separator' },
    { label: 'Quitter',            click: () => app.quit() },
  ]);

  tray.setToolTip('Mon Application Electron');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (win) win.isVisible() ? win.hide() : win.show();
  });
}

// Événements de cycle de vie
app.whenReady().then(() => {
  const mainWindow = createWindow();
  createTray();
  registerMediaKeys(mainWindow);
});

// Nettoyage des raccourcis avant la fermeture de l’app
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    const mainWindow = createWindow();
    registerMediaKeys(mainWindow);
  }
});
