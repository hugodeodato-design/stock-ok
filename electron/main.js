const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets', 'logo.png')
  });

  const devUrl = 'http://localhost:5173';
  const prodIndexCandidates = [
    path.join(process.resourcesPath, 'app', 'frontend', 'dist', 'index.html'),
    path.join(process.resourcesPath, 'frontend', 'dist', 'index.html'),
    path.join(__dirname, '..', 'frontend', 'dist', 'index.html')
  ];

  if (app.isPackaged) {
    let found = null;
    for (const p of prodIndexCandidates) {
      if (fs.existsSync(p)) {
        found = p;
        break;
      }
    }
    if (found) {
      win.loadFile(found);
    } else {
      console.error('Production index not found. Tried:', prodIndexCandidates);
      win.loadURL('data:text/html,<h1>Frontend not found in packaged app</h1>');
    }
  } else {
    win.loadURL(devUrl);
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() });
