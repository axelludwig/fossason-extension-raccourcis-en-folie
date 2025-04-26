import { app, BrowserWindow, screen, ipcMain, Menu } from 'electron';
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

let mainWindow: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    mainWindow.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    mainWindow.loadURL(url.href);
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Account',
      submenu: [
        {
          label: 'ApiKey',
          click: () => {
            mainWindow?.webContents.send('open-api-key-popup');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return mainWindow;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

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
});