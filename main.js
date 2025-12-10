const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    // Mode développeur (Vite server)
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // Mode production (Electron package)
    const indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
    win.loadFile(indexPath);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
