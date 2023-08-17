const { app, BrowserWindow } = require('electron');
const path = require('path'); // Require the path module

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icon.ico'), // Path to your icon file
    webPreferences: {
      nodeIntegration: false, // Disabling nodeIntegration for security
      contextIsolation: true  // Protecting against possible execution of remote code
    }
  });

  // Load the website
  win.loadURL('https://mangafire.to');
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
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
