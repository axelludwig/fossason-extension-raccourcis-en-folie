import { app, BrowserWindow, screen, ipcMain, Menu, globalShortcut, Tray, Size } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';


const appName = 'raccourci-en-folie';

function getConfigPath(): string {
  const baseDir =
    process.platform === 'win32'
      ? path.join(process.env.APPDATA || os.homedir(), appName)
      : path.join(os.homedir(), '.config', appName);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  return path.join(baseDir, 'user-data-conf.json');
}

const configPath = getConfigPath();

function readApiKey(): string | null {
  if (fs.existsSync(configPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return data.apiKey || null;
    } catch (err) {
      console.error('[FICHIER] Erreur lecture fichier config :', err);
    }
  }
  return null;
}

function writeApiKey(key: string): void {
  try {
    fs.writeFileSync(configPath, JSON.stringify({ apiKey: key }, null, 2), 'utf-8');
    console.log('[FICHIER] Cle API enregistree dans', configPath);
  } catch (err) {
    console.error('[FICHIER] Erreur ecriture fichier config :', err);
  }
}

let win: BrowserWindow | null = null;
let tray: Tray | null = null;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

/**
 * Enregistre les media keys, logge l'événement et envoie un IPC au renderer
 */
function registerMediaKeys(window: BrowserWindow) {
  const mappings: { [accelerator: string]: string } = {
    'MediaPlayPause': 'media-play-pause',
    'MediaNextTrack': 'media-next',
    'MediaPreviousTrack': 'media-prev',
    'VolumeUp': 'volume-up',
    'VolumeDown': 'volume-down',
    'VolumeMute': 'volume-mute',
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
  // const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const { width, height } = { width: 300, height: 52 };

  win = new BrowserWindow({
    width,
    height,
    transparent: true,  // <-- rend la fenêtre transparente
    frame: false,       // <-- supprime la bordure / barre de titre
    backgroundColor: '#00000000', // (Windows) assure la vraie transparence
    webPreferences: {
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

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Account',
      submenu: [
        {
          label: 'ApiKey',
          click: () => {
            win?.webContents.send('open-api-key-popup');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return win;
}

// Crée l’icône Tray
function createTray() {
  const iconPath = path.join(__dirname, '../src/assets/tray-icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Afficher la fenêtre', click: () => win?.show() },
    { label: 'Masquer la fenêtre', click: () => win?.hide() },
    { type: 'separator' },
    { label: 'Quitter', click: () => app.quit() },
  ]);

  tray.setToolTip('Mon Application Electron');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (win) win.isVisible() ? win.hide() : win.show();
  });
}

// Événements de cycle de vie
app.whenReady().then(() => {
  ipcMain.handle('get-api-key', () => {
    const value = readApiKey();
    console.log('[IPC] get-api-key : ', value);
    return value;
  });

  ipcMain.handle('set-api-key', (_event, key: string) => {
    console.log('[IPC] set-api-key : ', key);
    writeApiKey(key);
  });

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
