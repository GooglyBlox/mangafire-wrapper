const { app, BrowserWindow, globalShortcut, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const zoomFilePath = path.join(__dirname, 'zoom-level.json');

async function loadExtension(extensionName) {
  const extensionPath = path.join(__dirname, 'extensions', extensionName);
  try {
    await session.defaultSession.loadExtension(extensionPath);
    console.log(`${extensionName} extension added successfully.`);
  } catch (error) {
    console.error(`Failed to add ${extensionName} extension:`, error);
  }
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'renderer.js')
    }
  });

  await loadExtension('darkreader');

  win.loadURL('https://mangafire.to');

  win.webContents.on('did-finish-load', () => {
    fs.readFile(zoomFilePath, 'utf-8', (err, data) => {
      if (err) {
        console.log("Couldn't read zoom-level file, using default zoom level.");
        console.log(err);
      } else {
        try {
          const zoomLevel = JSON.parse(data).zoomLevel;
          console.log('Setting zoom to ', zoomLevel);
          win.webContents.setZoomFactor(zoomLevel);
        } catch (err) {
          console.log("Invalid zoom-level file content, using default zoom level.");
          console.log(err);
        }
      }
    });
  });
}

ipcMain.on('zoom-factor-changed', (event, zoomFactor) => {
  console.log('Saving zoom factor:', zoomFactor);
  fs.writeFileSync(zoomFilePath, JSON.stringify({ zoomLevel: zoomFactor }));
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
