// main.js - Electron Main Process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('src/index.html');
  // Uncomment for debugging:
  // mainWindow.webContents.openDevTools();
}

// App event listeners
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ==================== IPC Handlers (Communication between UI and Main Process) ====================

// Get data storage path
const storagePath = path.join(app.getPath('userData'), 'passwords.json');

// Load passwords from file
ipcMain.handle('load-passwords', async () => {
  try {
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading passwords:', error);
    return [];
  }
});

// Save passwords to file
ipcMain.handle('save-passwords', async (event, passwords) => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(passwords, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving passwords:', error);
    return { success: false, error: error.message };
  }
});

// Delete all passwords (for testing)
ipcMain.handle('clear-all-passwords', async () => {
  try {
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
    return { success: true };
  } catch (error) {
    console.error('Error clearing passwords:', error);
    return { success: false, error: error.message };
  }
});
