import { app, BrowserWindow, Tray, Menu } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL('data:text/html,<h1>Hello Electron in Tray!</h1>');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();

    tray = new Tray(path.join(__dirname, '../tray.ico')); // Remplace par le chemin de ton icône
    tray.setToolTip('Electron Tray App');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open App',
            click: () => {
                if (mainWindow === null) createWindow();
                else mainWindow.show();
            },
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => app.quit(),
        },
    ]);

    tray.setContextMenu(contextMenu);

    // Restaurer la fenêtre en cliquant sur l'icône du tray
    tray.on('double-click', () => {
        if (mainWindow === null) createWindow();
        else mainWindow.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
